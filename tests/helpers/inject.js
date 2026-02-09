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

module.exports = {
	injectAndWaitForButtons,
	injectScript,
	extractDmmUrls,
	CONTENT_SCRIPT_PATH,
};
