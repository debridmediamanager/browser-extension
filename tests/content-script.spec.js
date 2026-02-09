// @ts-check
const { test, expect } = require("@playwright/test");
const {
	injectAndWaitForButtons,
	extractDmmUrls,
	checkDmmButtonVisibility,
} = require("./helpers/inject");

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

		const vis = await checkDmmButtonVisibility(page);
		expect(vis.hidden).toEqual([]);
		expect(vis.visible).toBe(vis.total);

		const urls = await extractDmmUrls(page);
		expect(urls).toHaveLength(1);
		expect(urls[0]).toBe("https://x.debridmediamanager.com/tt9784708");
	});

	test("list page", async ({ page }) => {
		await page.goto("https://www.imdb.com/list/ls540852272/", {
			waitUntil: "domcontentloaded",
		});
		await page.waitForSelector(".ipc-metadata-list-summary-item", {
			timeout: 30_000,
		});

		const btns = await injectAndWaitForButtons(page);
		expect(await btns.count()).toBeGreaterThan(0);

		const vis = await checkDmmButtonVisibility(page);
		expect(vis.hidden).toEqual([]);
		expect(vis.visible).toBe(vis.total);

		const urls = await extractDmmUrls(page);
		expect(urls.length).toBeGreaterThan(0);
		for (const url of urls) {
			expect(url).toMatch(
				/^https:\/\/x\.debridmediamanager\.com\/tt\d+$/
			);
		}
	});

	test("chart/top page", async ({ page }) => {
		await page.goto("https://www.imdb.com/chart/top/", {
			waitUntil: "domcontentloaded",
		});
		await page.waitForSelector(".cli-title", { timeout: 30_000 });

		const btns = await injectAndWaitForButtons(page);
		expect(await btns.count()).toBeGreaterThan(0);

		const vis = await checkDmmButtonVisibility(page);
		expect(vis.hidden).toEqual([]);
		expect(vis.visible).toBe(vis.total);

		const urls = await extractDmmUrls(page);
		expect(urls.length).toBeGreaterThan(0);
		for (const url of urls) {
			expect(url).toMatch(
				/^https:\/\/x\.debridmediamanager\.com\/tt\d+$/
			);
		}
	});

	test("chart/toptv page", async ({ page }) => {
		await page.goto("https://www.imdb.com/chart/toptv/", {
			waitUntil: "domcontentloaded",
		});
		await page.waitForSelector(".cli-title", { timeout: 30_000 });

		const btns = await injectAndWaitForButtons(page);
		expect(await btns.count()).toBeGreaterThan(0);

		const vis = await checkDmmButtonVisibility(page);
		expect(vis.hidden).toEqual([]);
		expect(vis.visible).toBe(vis.total);

		const urls = await extractDmmUrls(page);
		expect(urls.length).toBeGreaterThan(0);
		for (const url of urls) {
			expect(url).toMatch(
				/^https:\/\/x\.debridmediamanager\.com\/tt\d+$/
			);
		}
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

		const vis = await checkDmmButtonVisibility(page);
		expect(vis.hidden).toEqual([]);
		expect(vis.visible).toBe(vis.total);

		const urls = await extractDmmUrls(page);
		expect(urls).toHaveLength(1);
		expect(urls[0]).toBe("https://x.debridmediamanager.com/tt9784708");
	});
});

// ---------------------------------------------------------------------------
// MDBList
// ---------------------------------------------------------------------------
test.describe("MDBList", () => {
	test("movie page", async ({ page }) => {
		await page.goto("https://mdblist.com/movie/tt9466114", {
			waitUntil: "load",
		});
		await page.waitForSelector("h1.movie-hero__title", { timeout: 30_000 });

		const btns = await injectAndWaitForButtons(page);
		await expect(btns).toHaveCount(1);

		const vis = await checkDmmButtonVisibility(page);
		expect(vis.hidden).toEqual([]);
		expect(vis.visible).toBe(vis.total);

		const urls = await extractDmmUrls(page);
		expect(urls).toHaveLength(1);
		expect(urls[0]).toBe("https://x.debridmediamanager.com/tt9466114");
	});

	test("show page", async ({ page }) => {
		await page.goto("https://mdblist.com/show/tt13649112", {
			waitUntil: "load",
		});
		await page.waitForSelector("h1.movie-hero__title", { timeout: 30_000 });

		const btns = await injectAndWaitForButtons(page);
		await expect(btns).toHaveCount(1);

		const vis = await checkDmmButtonVisibility(page);
		expect(vis.hidden).toEqual([]);
		expect(vis.visible).toBe(vis.total);

		const urls = await extractDmmUrls(page);
		expect(urls).toHaveLength(1);
		expect(urls[0]).toBe("https://x.debridmediamanager.com/tt13649112");
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

		const vis = await checkDmmButtonVisibility(page);
		expect(vis.hidden).toEqual([]);
		expect(vis.visible).toBe(vis.total);

		const urls = await extractDmmUrls(page);
		expect(urls.length).toBeGreaterThan(0);
		for (const url of urls) {
			expect(url).toMatch(
				/^https:\/\/x\.debridmediamanager\.com\/tt\d+$/
			);
		}
	});
});

// ---------------------------------------------------------------------------
// Trakt.tv — requires CDP connection to real Chrome (Cloudflare Turnstile
// blocks Playwright's Chromium). See tests/trakt-cdp.spec.js
// ---------------------------------------------------------------------------

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

		const vis = await checkDmmButtonVisibility(page);
		expect(vis.hidden).toEqual([]);
		expect(vis.visible).toBe(vis.total);

		const urls = await extractDmmUrls(page);
		expect(urls).toHaveLength(1);
		// Fight Club = tt0137523
		expect(urls[0]).toBe("https://x.debridmediamanager.com/tt0137523");
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

		const vis = await checkDmmButtonVisibility(page);
		expect(vis.hidden).toEqual([]);
		expect(vis.visible).toBe(vis.total);

		const urls = await extractDmmUrls(page);
		expect(urls.length).toBeGreaterThan(0);
		for (const url of urls) {
			expect(url).toMatch(
				/^https:\/\/x\.debridmediamanager\.com\/tt\d+$/
			);
		}
	});
});


// ---------------------------------------------------------------------------
// Letterboxd
// ---------------------------------------------------------------------------
test.describe("Letterboxd", () => {
	test("single film page", async ({ page }) => {
		await page.goto("https://letterboxd.com/film/the-idea-of-you-2024/", {
			waitUntil: "load",
		});
		await page.waitForSelector("h1.headline-1", { timeout: 30_000 });

		const btns = await injectAndWaitForButtons(page);
		await expect(btns).toHaveCount(1);

		const vis = await checkDmmButtonVisibility(page);
		expect(vis.hidden).toEqual([]);
		expect(vis.visible).toBe(vis.total);

		const urls = await extractDmmUrls(page);
		expect(urls).toHaveLength(1);
		expect(urls[0]).toMatch(
			/^https:\/\/x\.debridmediamanager\.com\/tt\d+$/
		);
	});
});

// ---------------------------------------------------------------------------
// JustWatch
// ---------------------------------------------------------------------------
test.describe("JustWatch", () => {
	test("movie page", async ({ page }) => {
		await page.goto("https://www.justwatch.com/us/movie/dune-part-two", {
			waitUntil: "load",
		});
		await page.waitForSelector("h1", { timeout: 30_000 });

		const btns = await injectAndWaitForButtons(page);
		await expect(btns).toHaveCount(1);

		const vis = await checkDmmButtonVisibility(page);
		expect(vis.hidden).toEqual([]);
		expect(vis.visible).toBe(vis.total);

		const urls = await extractDmmUrls(page);
		expect(urls).toHaveLength(1);
		expect(urls[0]).toBe("https://x.debridmediamanager.com/tt15239678");
	});
});

// ---------------------------------------------------------------------------
// TheTVDB
// ---------------------------------------------------------------------------
test.describe("TheTVDB", () => {
	test("movie page", async ({ page }) => {
		await page.goto("https://thetvdb.com/movies/dune-part-two", {
			waitUntil: "domcontentloaded",
		});
		await page.waitForSelector("h1#series_title", { timeout: 30_000 });

		const btns = await injectAndWaitForButtons(page);
		await expect(btns).toHaveCount(1);

		const vis = await checkDmmButtonVisibility(page);
		expect(vis.hidden).toEqual([]);
		expect(vis.visible).toBe(vis.total);

		const urls = await extractDmmUrls(page);
		expect(urls).toHaveLength(1);
		expect(urls[0]).toBe("https://x.debridmediamanager.com/tt15239678");
	});

	test("series page", async ({ page }) => {
		await page.goto("https://thetvdb.com/series/game-of-thrones", {
			waitUntil: "domcontentloaded",
		});
		await page.waitForSelector("h1#series_title", { timeout: 30_000 });

		const btns = await injectAndWaitForButtons(page);
		await expect(btns).toHaveCount(1);

		const vis = await checkDmmButtonVisibility(page);
		expect(vis.hidden).toEqual([]);
		expect(vis.visible).toBe(vis.total);

		const urls = await extractDmmUrls(page);
		expect(urls).toHaveLength(1);
		expect(urls[0]).toBe("https://x.debridmediamanager.com/tt0944947");
	});
});

// ---------------------------------------------------------------------------
// Criticker
// ---------------------------------------------------------------------------
test.describe("Criticker", () => {
	test("single film page", async ({ page }) => {
		await page.goto("https://www.criticker.com/film/Dune-Part-Two/", {
			waitUntil: "domcontentloaded",
		});
		await page.waitForSelector("h1", { timeout: 30_000 });

		const btns = await injectAndWaitForButtons(page);
		await expect(btns).toHaveCount(1);

		const vis = await checkDmmButtonVisibility(page);
		expect(vis.hidden).toEqual([]);
		expect(vis.visible).toBe(vis.total);

		const urls = await extractDmmUrls(page);
		expect(urls).toHaveLength(1);
		expect(urls[0]).toBe("https://x.debridmediamanager.com/tt15239678");
	});
});

// ---------------------------------------------------------------------------
// Metacritic
// ---------------------------------------------------------------------------
test.describe("Metacritic", () => {
	test("movie page", async ({ page }) => {
		await page.goto("https://www.metacritic.com/movie/dune-part-two/", {
			waitUntil: "load",
		});
		await page.waitForSelector("h1", { timeout: 30_000 });

		const btns = await injectAndWaitForButtons(page);
		await expect(btns).toHaveCount(1);

		const vis = await checkDmmButtonVisibility(page);
		expect(vis.hidden).toEqual([]);
		expect(vis.visible).toBe(vis.total);

		const urls = await extractDmmUrls(page);
		expect(urls).toHaveLength(1);
		expect(urls[0]).toBe("https://x.debridmediamanager.com/tt15239678");
	});
});
