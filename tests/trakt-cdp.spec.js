// @ts-check
const { test, expect, chromium } = require("@playwright/test");
const { injectAndWaitForButtons, injectScript, extractDmmUrls } = require("./helpers/inject");

// Connect to the user's real Chrome via CDP
test.use({
	connectOptions: { wsEndpoint: "" }, // placeholder, we connect manually
});

/** @type {import('@playwright/test').Browser} */
let browser;

test.beforeAll(async () => {
	browser = await chromium.connectOverCDP("http://127.0.0.1:9222");
});

test.afterAll(async () => {
	if (browser) await browser.close();
});

test.describe("Trakt.tv (CDP)", () => {
	test("show page", async () => {
		const context = browser.contexts()[0] || await browser.newContext();
		const page = await context.newPage();
		try {
			await page.goto("https://trakt.tv/shows/fallout", {
				waitUntil: "domcontentloaded",
			});
			await page.waitForSelector("#summary-wrapper div > h1", {
				timeout: 30_000,
			});
			const btns = await injectAndWaitForButtons(page);
			await expect(btns).toHaveCount(1);

			const urls = await extractDmmUrls(page);
			expect(urls).toHaveLength(1);
			expect(urls[0]).toMatch(
				/^https:\/\/x\.debridmediamanager\.com\/tt\d+$/
			);
		} finally {
			await page.close();
		}
	});

	test("movie page", async () => {
		const context = browser.contexts()[0] || await browser.newContext();
		const page = await context.newPage();
		try {
			await page.goto(
				"https://trakt.tv/movies/ghostbusters-frozen-empire-2024",
				{ waitUntil: "domcontentloaded" }
			);
			await page.waitForSelector("#summary-wrapper div > h1", {
				timeout: 30_000,
			});
			const btns = await injectAndWaitForButtons(page);
			await expect(btns).toHaveCount(1);

			const urls = await extractDmmUrls(page);
			expect(urls).toHaveLength(1);
			expect(urls[0]).toMatch(
				/^https:\/\/x\.debridmediamanager\.com\/tt\d+$/
			);
		} finally {
			await page.close();
		}
	});

	test("episode page — should NOT inject buttons", async () => {
		const context = browser.contexts()[0] || await browser.newContext();
		const page = await context.newPage();
		try {
			await page.goto(
				"https://trakt.tv/shows/shogun-2024/seasons/1/episodes/1",
				{ waitUntil: "domcontentloaded" }
			);
			await page.waitForSelector("#summary-wrapper div > h1", {
				timeout: 30_000,
			});
			await injectScript(page);
			await page.waitForTimeout(3_000);
			const btns = page.locator("[data-dmm-btn-added]");
			await expect(btns).toHaveCount(0);
		} finally {
			await page.close();
		}
	});
});
