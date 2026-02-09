// @ts-check
const { test, expect } = require("@playwright/test");
const { injectAndWaitForButtons, injectScript } = require("./helpers/inject");

const IMDB_COOKIES = [
	{
		name: "session-id",
		value: "131-8190016-5036534",
		domain: ".imdb.com",
		path: "/",
	},
	{
		name: "session-id-time",
		value: "2082787201l",
		domain: ".imdb.com",
		path: "/",
	},
	{
		name: "ubid-main",
		value: "132-8373618-9475446",
		domain: ".imdb.com",
		path: "/",
	},
	{
		name: "ad-oo",
		value: "0",
		domain: ".imdb.com",
		path: "/",
	},
	{
		name: "ci",
		value: "eyJwdXJwb3NlcyI6W10sInZlbmRvcnMiOltdLCJhZ2VTaWduYWwiOiJBRFVMVCIsImlzR2RwciI6dHJ1ZX0",
		domain: ".imdb.com",
		path: "/",
	},
	{
		name: "session-token",
		value: "FTJcCDVLgRcHZEn0J/fNgluQf2NpYYXxmcPN0pXQumGO6Q8C3HCicRAQwXSQFTLs1DHk7L2BixtxprQUlPnNoLD6Czde1LeYTADsOvPQisDQ3XxUQFsOS1cE4vpvRIDZvlmIy5NP4NoTe8wQV+HQEz6jcCxDIVK6CikqsWuxhCH/0BQBJr+F7ijOAtvzsl/NPHHwbSCZqQ1P6Kp9qd5sLpdsJHbXAWS1BrijndyfK6h9fGmO/YXpAA8KA6EOivp4QYWpMSP07Q67nhuEa/MN3DjuahsSHzTCHeqpNZ9eJKm9gBeIgz/N8JkAHQjT4oR5Hl60Evn/wDcWNnFlu9O8ldAYmEuF26/+",
		domain: ".imdb.com",
		path: "/",
	},
	{
		name: "csm-hit",
		value: "tb:s-YQ3Y6D124742RWTZQ952|1770607819081&t:1770607819238&adb:adblk_yes",
		domain: "www.imdb.com",
		path: "/",
	},
];

// ---------------------------------------------------------------------------
// IMDB (www)
// ---------------------------------------------------------------------------
test.describe("IMDB www", () => {
	test.beforeEach(async ({ context }) => {
		await context.addCookies(IMDB_COOKIES);
	});

	test("single title page", async ({ page }) => {
		await page.goto("https://www.imdb.com/title/tt9784708/", {
			waitUntil: "domcontentloaded",
		});
		await page.waitForSelector("section.ipc-page-background h1 > span", {
			timeout: 30_000,
		});
		const btns = await injectAndWaitForButtons(page);
		await expect(btns).toHaveCount(1);
	});

	test("list page — broken: .lister-item selectors no longer exist", async ({
		page,
	}) => {
		await page.goto("https://www.imdb.com/list/ls540852272/", {
			waitUntil: "domcontentloaded",
		});
		// IMDB now uses .ipc-metadata-list-summary-item instead of .lister-item
		await page.waitForSelector(".ipc-metadata-list-summary-item", {
			timeout: 30_000,
		});

		const ok = await injectScript(page);
		await page.waitForTimeout(2_000);

		const btns = page.locator("[data-dmm-btn-added]");
		// Script runs but finds no matching elements
		expect(ok).toBe(true);
		await expect(btns).toHaveCount(0);
	});

	test("chart/top page — broken: .cli-title no longer has number prefix", async ({
		page,
	}) => {
		await page.goto("https://www.imdb.com/chart/top/", {
			waitUntil: "domcontentloaded",
		});
		await page.waitForSelector(".cli-title", { timeout: 30_000 });

		// Script filters for innerText matching /\d+\./ but IMDB removed
		// the rank number from .cli-title elements
		const ok = await injectScript(page);
		await page.waitForTimeout(2_000);

		const btns = page.locator("[data-dmm-btn-added]");
		expect(ok).toBe(true);
		await expect(btns).toHaveCount(0);
	});

	test("chart/toptv page — broken: .cli-title no longer has number prefix", async ({
		page,
	}) => {
		await page.goto("https://www.imdb.com/chart/toptv/", {
			waitUntil: "domcontentloaded",
		});
		await page.waitForSelector(".cli-title", { timeout: 30_000 });

		const ok = await injectScript(page);
		await page.waitForTimeout(2_000);

		const btns = page.locator("[data-dmm-btn-added]");
		expect(ok).toBe(true);
		await expect(btns).toHaveCount(0);
	});
});

// ---------------------------------------------------------------------------
// IMDB (mobile)
// ---------------------------------------------------------------------------
test.describe("IMDB mobile", () => {
	test.beforeEach(async ({ context }) => {
		await context.addCookies(IMDB_COOKIES);
	});

	test("single title page", async ({ page }) => {
		await page.goto("https://m.imdb.com/title/tt9784708/", {
			waitUntil: "domcontentloaded",
		});
		await page.waitForSelector("section.ipc-page-background h1 > span", {
			timeout: 30_000,
		});
		const btns = await injectAndWaitForButtons(page);
		await expect(btns).toHaveCount(1);
	});
});

// ---------------------------------------------------------------------------
// MDBList
// ---------------------------------------------------------------------------
test.describe("MDBList", () => {
	test("movie page — broken: selector #content-desktop-2 h3 no longer exists", async ({
		page,
	}) => {
		await page.goto("https://mdblist.com/movie/tt9466114", {
			waitUntil: "load",
		});
		// The site now uses h1.movie-hero__title, but the content script
		// targets #content-desktop-2 > div > div:nth-child(1) > h3
		await page.waitForSelector("h1.movie-hero__title", { timeout: 30_000 });

		const ok = await injectScript(page);
		await page.waitForTimeout(2_000);

		const btns = page.locator("[data-dmm-btn-added]");
		// Script errors because selector doesn't match — no buttons added
		expect(ok).toBe(false);
		await expect(btns).toHaveCount(0);
	});

	test("show page — broken: selector #content-desktop-2 h3 no longer exists", async ({
		page,
	}) => {
		await page.goto("https://mdblist.com/show/tt13649112", {
			waitUntil: "load",
		});
		await page.waitForSelector("h1.movie-hero__title", { timeout: 30_000 });

		const ok = await injectScript(page);
		await page.waitForTimeout(2_000);

		const btns = page.locator("[data-dmm-btn-added]");
		expect(ok).toBe(false);
		await expect(btns).toHaveCount(0);
	});

	test("search results / list page", async ({ page }) => {
		await page.goto(
			"https://mdblist.com/lists/linaspurinis/top-watched-movies-of-the-week",
			{ waitUntil: "load" }
		);
		await page.waitForSelector("div.ui.centered.cards", {
			timeout: 30_000,
		});

		const btns = await injectAndWaitForButtons(page);
		expect(await btns.count()).toBeGreaterThan(0);
	});
});

// ---------------------------------------------------------------------------
// AniDB
// ---------------------------------------------------------------------------
test.describe("AniDB", () => {
	test("single title page", async ({ page }) => {
		await page.goto("https://anidb.net/anime/17617", {
			waitUntil: "domcontentloaded",
		});
		await page.waitForSelector("#layout-main > h1.anime", {
			timeout: 30_000,
		});

		const btns = await injectAndWaitForButtons(page);
		expect(await btns.count()).toBeGreaterThanOrEqual(1);
	});

	test("season page", async ({ page }) => {
		await page.goto("https://anidb.net/anime/season/?do.filter=1", {
			waitUntil: "domcontentloaded",
		});
		await page.waitForSelector('a[href*="/anime/"]', { timeout: 30_000 });

		const btns = await injectAndWaitForButtons(page);
		expect(await btns.count()).toBeGreaterThan(0);
	});
});

// ---------------------------------------------------------------------------
// Trakt.tv — blocked by Cloudflare Turnstile (cf_clearance is fingerprint-bound)
// ---------------------------------------------------------------------------
test.describe("Trakt.tv", () => {
	test.skip(true, "Trakt.tv uses Cloudflare Turnstile — cf_clearance is fingerprint-bound and cannot be transferred to headless browsers");

	test("show page", async ({ page }) => {
		await page.goto("https://trakt.tv/shows/fallout", {
			waitUntil: "domcontentloaded",
		});
		await page.waitForSelector("#summary-wrapper div > h1", {
			timeout: 30_000,
		});
		const btns = await injectAndWaitForButtons(page);
		await expect(btns).toHaveCount(1);
	});

	test("movie page", async ({ page }) => {
		await page.goto(
			"https://trakt.tv/movies/ghostbusters-frozen-empire-2024",
			{ waitUntil: "domcontentloaded" }
		);
		await page.waitForSelector("#summary-wrapper div > h1", {
			timeout: 30_000,
		});
		const btns = await injectAndWaitForButtons(page);
		await expect(btns).toHaveCount(1);
	});

	test("episode page — should NOT inject buttons", async ({ page }) => {
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
	});
});

// ---------------------------------------------------------------------------
// iCheckMovies (www)
// ---------------------------------------------------------------------------
test.describe("iCheckMovies www", () => {
	test("single title page", async ({ page }) => {
		await page.goto("https://www.icheckmovies.com/movies/fight+club/", {
			waitUntil: "domcontentloaded",
		});
		await page.waitForSelector("#movie > h1", { timeout: 30_000 });

		const btns = await injectAndWaitForButtons(page);
		await expect(btns).toHaveCount(1);
	});

	test("list page", async ({ page }) => {
		await page.goto(
			"https://www.icheckmovies.com/lists/imdbs+top+250/",
			{ waitUntil: "domcontentloaded" }
		);
		await page.waitForSelector("ol#itemListMovies > li", {
			timeout: 30_000,
		});

		const btns = await injectAndWaitForButtons(page);
		expect(await btns.count()).toBeGreaterThan(0);
	});
});

// ---------------------------------------------------------------------------
// iCheckMovies (beta) — requires login, redirects to login page
// ---------------------------------------------------------------------------
test.describe("iCheckMovies beta", () => {
	test.skip(true, "beta.icheckmovies.com requires login");

	test("single title page", async ({ page }) => {
		await page.goto(
			"https://beta.icheckmovies.com/movies/1-the+shawshank+redemption",
			{ waitUntil: "domcontentloaded" }
		);
		await page.waitForSelector("h1.title", { timeout: 30_000 });
		const btns = await injectAndWaitForButtons(page);
		await expect(btns).toHaveCount(1);
	});

	test("list page", async ({ page }) => {
		await page.goto(
			"https://beta.icheckmovies.com/lists/1-imdbs+top+250",
			{ waitUntil: "domcontentloaded" }
		);
		await page.waitForSelector("div.media-content", {
			timeout: 30_000,
		});
		const btns = await injectAndWaitForButtons(page);
		expect(await btns.count()).toBeGreaterThan(0);
	});
});

// ---------------------------------------------------------------------------
// Letterboxd — broken: content script looks for h1.filmtitle which no
// longer exists (site now uses h1.headline-1.primaryname)
// ---------------------------------------------------------------------------
test.describe("Letterboxd", () => {
	test("single film page — broken: h1.filmtitle selector no longer exists", async ({
		page,
	}) => {
		await page.goto("https://letterboxd.com/film/the-idea-of-you-2024/", {
			waitUntil: "load",
		});
		// The site now uses h1.headline-1.primaryname instead of h1.filmtitle
		await page.waitForSelector("h1.headline-1", { timeout: 30_000 });

		// Script will crash because it finds the IMDb link but then
		// querySelector("h1.filmtitle") returns null → setAttribute throws
		const ok = await injectScript(page);
		await page.waitForTimeout(2_000);

		const btns = page.locator("[data-dmm-btn-added]");
		expect(ok).toBe(false);
		await expect(btns).toHaveCount(0);
	});
});
