const fs = require("fs");
const path = require("path");

const CONTENT_SCRIPT_PATH = path.resolve(
	__dirname,
	"..",
	"..",
	"content_script.js"
);

const SCRIPT_CONTENT = fs.readFileSync(CONTENT_SCRIPT_PATH, "utf8");

/**
 * Inject content_script.js into the page via page.evaluate() (bypasses CSP)
 * and wait for DMM buttons to appear.
 * @param {import('@playwright/test').Page} page
 * @param {object} [opts]
 * @param {number} [opts.timeout] - ms to wait for buttons (default 10000)
 * @returns {Promise<import('@playwright/test').Locator>} locator for all [data-dmm-btn-added] elements
 */
async function injectAndWaitForButtons(page, opts = {}) {
	const timeout = opts.timeout ?? 10_000;

	// Use evaluate() instead of addScriptTag() to bypass CSP restrictions
	await page.evaluate(SCRIPT_CONTENT);

	const locator = page.locator("[data-dmm-btn-added]");
	await locator.first().waitFor({ state: "attached", timeout });

	return locator;
}

/**
 * Inject content_script.js without waiting for buttons.
 * Useful for negative tests or tests where the script may error.
 * Returns true if the script ran without errors, false if it threw.
 * @param {import('@playwright/test').Page} page
 * @returns {Promise<boolean>}
 */
async function injectScript(page) {
	try {
		await page.evaluate(SCRIPT_CONTENT);
		return true;
	} catch {
		return false;
	}
}

/**
 * Extract DMM destination URLs from injected buttons/links.
 * Buttons use window.open() in onclick closures, so we intercept it.
 * Links use href directly.
 * @param {import('@playwright/test').Page} page
 * @returns {Promise<string[]>} array of DMM URLs
 */
async function extractDmmUrls(page) {
	return page.evaluate(() => {
		const DMM_URL_RE =
			/^https:\/\/(x\.)?debridmediamanager\.com\//;
		const urls = [];
		const origOpen = window.open;
		window.open = (url) => {
			if (typeof url === "string" && DMM_URL_RE.test(url))
				urls.push(url);
		};

		// Click all DMM buttons to capture their window.open URLs
		document
			.querySelectorAll("[data-dmm-btn-added] button")
			.forEach((btn) => btn.click());

		// Collect hrefs from <a> elements that point to DMM
		document
			.querySelectorAll("[data-dmm-btn-added] a[href]")
			.forEach((link) => {
				if (DMM_URL_RE.test(link.href)) urls.push(link.href);
			});

		window.open = origOpen;
		return urls;
	});
}

/**
 * Assert that every injected DMM button/link is visible to the user
 * (non-zero dimensions, not clipped by overflow, not hidden by CSS).
 * @param {import('@playwright/test').Page} page
 * @returns {Promise<{total: number, visible: number, hidden: string[]}>}
 */
async function checkDmmButtonVisibility(page) {
	return page.evaluate(() => {
		const results = { total: 0, visible: 0, hidden: [] };
		// Find only the actual DMM button/link elements (not their parents)
		const buttons = document.querySelectorAll(
			"[data-dmm-btn-added] button, [data-dmm-btn-added] + button"
		);
		const links = document.querySelectorAll(
			"[data-dmm-btn-added] a[href]"
		);
		const DMM_RE = /debridmediamanager\.com/;
		const all = new Set([
			...Array.from(buttons).filter((b) => b.textContent.includes("DMM")),
			...Array.from(links).filter((a) => DMM_RE.test(a.href)),
		]);

		for (const el of all) {
			// Skip elements hidden by the site (ancestor display:none) —
			// e.g. paginated list items. These aren't our visibility bugs.
			let hiddenBySite = false;
			let ancestor = el.parentElement;
			while (ancestor) {
				if (window.getComputedStyle(ancestor).display === "none") {
					hiddenBySite = true;
					break;
				}
				ancestor = ancestor.parentElement;
			}
			if (hiddenBySite) continue;

			results.total++;
			const rect = el.getBoundingClientRect();
			const style = window.getComputedStyle(el);
			const isVisible =
				rect.width > 0 &&
				rect.height > 0 &&
				style.visibility !== "hidden" &&
				style.display !== "none" &&
				style.opacity !== "0";

			// Check if clipped by ancestor overflow
			let clipped = false;
			let parent = el.parentElement;
			while (parent) {
				const ps = window.getComputedStyle(parent);
				if (ps.overflow === "hidden" || ps.overflowX === "hidden") {
					const pr = parent.getBoundingClientRect();
					if (rect.right > pr.right + 1 || rect.left < pr.left - 1) {
						clipped = true;
						break;
					}
				}
				parent = parent.parentElement;
			}

			if (isVisible && !clipped) {
				results.visible++;
			} else {
				const label = el.textContent.trim().substring(0, 30);
				results.hidden.push(
					`"${label}" (${clipped ? "clipped by overflow" : `css: display=${style.display}, visibility=${style.visibility}, ${rect.width}x${rect.height}`})`
				);
			}
		}
		return results;
	});
}

module.exports = {
	injectAndWaitForButtons,
	injectScript,
	extractDmmUrls,
	checkDmmButtonVisibility,
	CONTENT_SCRIPT_PATH,
};
