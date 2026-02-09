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

module.exports = { injectAndWaitForButtons, injectScript, CONTENT_SCRIPT_PATH };
