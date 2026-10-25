// @ts-check
const fs = require("fs");
const path = require("path");
const { test, expect } = require("@playwright/test");
const {
	injectAndWaitForButtons,
	injectScript,
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

	test("tv show page", async ({ page }) => {
		await page.goto("https://www.justwatch.com/us/tv-show/ripley", {
			waitUntil: "load",
		});
		await page.waitForSelector("h1", { timeout: 30_000 });

		await injectAndWaitForButtons(page);
		const urls = await extractDmmUrls(page);
		expect(urls).toEqual(["https://x.debridmediamanager.com/tt11016042"]);
	});

	test("localized movie page", async ({ page }) => {
		await page.goto(
			"https://www.justwatch.com/de/Film/Avatar-Aufbruch-nach-Pandora",
			{ waitUntil: "load" }
		);
		await page.waitForSelector("h1", { timeout: 30_000 });

		await injectAndWaitForButtons(page);
		const urls = await extractDmmUrls(page);
		expect(urls).toEqual(["https://x.debridmediamanager.com/tt0499549"]);
	});

	test("client-side navigation drops the stale button", async ({ page }) => {
		await page.goto("https://www.justwatch.com/us/movie/dune-part-two", {
			waitUntil: "load",
		});
		await page.waitForSelector("h1", { timeout: 30_000 });
		await injectAndWaitForButtons(page);

		// The page's data stays from the first title, so no button may point at it.
		const path = await page.evaluate(() => {
			const a = [...document.querySelectorAll('a[href*="/us/movie/"]')].find(
				(a) => !a.href.includes("dune-part-two")
			);
			a.click();
			return new URL(a.href).pathname;
		});
		await page.waitForURL((url) => url.pathname === path);
		await page.waitForTimeout(2_000);
		expect(await extractDmmUrls(page)).toEqual([]);
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

// ---------------------------------------------------------------------------
// Sites whose id is looked up (page link, Trakt, TVmaze, Wikidata, AniList,
// Kitsu) or that link DMM's anime pages
// ---------------------------------------------------------------------------
const DMM = "https://debridmediamanager.com";
const X_DMM = "https://x.debridmediamanager.com";
const LOOKUP_PAGES = [
	["TMDB movie", "https://www.themoviedb.org/movie/693134-dune-part-two", "section.header .title h2", `${X_DMM}/tt15239678`],
	["TMDB tv", "https://www.themoviedb.org/tv/126308-shogun", "section.header .title h2", `${X_DMM}/tt2788316`],
	["Serializd show", "https://www.serializd.com/show/shogun-126308", "h1.big-heading", `${X_DMM}/tt2788316`],
	["TVmaze show", "https://www.tvmaze.com/shows/37336/shogun", "h1", `${X_DMM}/tt2788316`],
	["Simkl movie", "https://simkl.com/movies/1321382/dune-part-two", "h1", `${X_DMM}/tt15239678`],
	["Wikipedia film", "https://en.wikipedia.org/wiki/Dune:_Part_Two", "#firstHeading", `${X_DMM}/tt15239678`],
	["Wikipedia (de) film", "https://de.wikipedia.org/wiki/Dune:_Part_Two", "#firstHeading", `${X_DMM}/tt15239678`],
	["AniDB anime", "https://anidb.net/anime/17617", "h1.anime", `${DMM}/anime/17617`],
	["MyAnimeList anime", "https://myanimelist.net/anime/52991/Sousou_no_Frieren", "h1.title-name", `${DMM}/anime/mal-52991`],
	["AniList anime", "https://anilist.co/anime/154587/Sousou-no-Frieren/", "h1", `${DMM}/anime/mal-52991`],
	["Kitsu anime", "https://kitsu.app/anime/sousou-no-frieren", "section.media--title h3", `${DMM}/anime/mal-52991`],
	["LiveChart anime", "https://www.livechart.me/anime/11376", "div.text-xl.font-medium.line-clamp-1:not(.md\\:hidden)", `${DMM}/anime/17617`],
];

test.describe("Lookup sites", () => {
	for (const [name, url, title, expected] of LOOKUP_PAGES) {
		test(name, async ({ page }) => {
			await page.goto(url, { waitUntil: "domcontentloaded" });
			await page.waitForSelector(title, { timeout: 30_000 });

			await injectAndWaitForButtons(page);
			const vis = await checkDmmButtonVisibility(page);
			expect(vis.hidden).toEqual([]);
			expect(await extractDmmUrls(page)).toEqual([expected]);
		});
	}

	test("Wikipedia person gets no button", async ({ page }) => {
		await page.goto("https://en.wikipedia.org/wiki/Timoth%C3%A9e_Chalamet", {
			waitUntil: "domcontentloaded",
		});
		await page.waitForSelector("#firstHeading", { timeout: 30_000 });
		await injectScript(page);
		await page.waitForTimeout(3_000);
		await expect(page.locator("[data-dmm-btn-added]")).toHaveCount(0);
	});

	test("AniList client-side navigation follows the new title", async ({ page }) => {
		await page.goto("https://anilist.co/anime/154587/Sousou-no-Frieren/", {
			waitUntil: "domcontentloaded",
		});
		await page.waitForSelector("h1", { timeout: 30_000 });
		await injectAndWaitForButtons(page);

		await page.click('a[href^="/anime/182255/"]');
		await page.waitForURL(/\/anime\/182255\//);
		await expect
			.poll(() => extractDmmUrls(page), { timeout: 15_000 })
			.toEqual([`${DMM}/anime/mal-59978`]);
	});
});

// ---------------------------------------------------------------------------
// Season pages open the season on DMM
// ---------------------------------------------------------------------------
const GOT = `${DMM}/show/tt0944947`;
const SEASON_PAGES = [
	["IMDb episodes", "https://www.imdb.com/title/tt0944947/episodes/?season=3", "h1.ipc-title__text", `${GOT}/3`],
	["JustWatch", "https://www.justwatch.com/us/tv-show/game-of-thrones/season-3", "h1", `${GOT}/3`],
	["JustWatch localized", "https://www.justwatch.com/de/Serie/shogun-2024/Staffel-2", "h1", `${DMM}/show/tt2788316/2`],
	["TheTVDB official order", "https://thetvdb.com/series/game-of-thrones/seasons/official/3", "h1", `${GOT}/3`],
	["Metacritic", "https://www.metacritic.com/tv/game-of-thrones/season-3/", "div.hero-season-title__season", `${GOT}/3`],
	["TMDB", "https://www.themoviedb.org/tv/1399-game-of-thrones/season/3", "section.header .title h2", `${GOT}/3`],
	["Serializd", "https://www.serializd.com/show/Game-of-Thrones-1399/season/3626/3", "h1.big-heading", `${GOT}/3`],
	["TVmaze", "https://www.tvmaze.com/seasons/63232/game-of-thrones-season-8", "h1", `${GOT}/8`],
];

test.describe("Season pages", () => {
	for (const [name, url, title, expected] of SEASON_PAGES) {
		test(name, async ({ page }) => {
			await page.goto(url, { waitUntil: "domcontentloaded" });
			await page.waitForSelector(title, { timeout: 30_000 });

			await injectAndWaitForButtons(page);
			expect(await extractDmmUrls(page)).toEqual([expected]);
		});
	}

	test("IMDb season tabs follow the season", async ({ page }) => {
		await page.context().addCookies(IMDB_COOKIES);
		await page.goto("https://www.imdb.com/title/tt0944947/episodes/?season=3", {
			waitUntil: "domcontentloaded",
		});
		await page.waitForSelector("h1.ipc-title__text", { timeout: 30_000 });
		await injectAndWaitForButtons(page);

		await page.click('a[href*="episodes/?season=5"]');
		await page.waitForURL(/season=5/);
		await expect
			.poll(() => extractDmmUrls(page), { timeout: 15_000 })
			.toEqual([`${GOT}/5`]);
	});

	test("IMDb pages without a title element do not throw", async ({ page }) => {
		await page.context().addCookies(IMDB_COOKIES);
		await page.goto("https://www.imdb.com/title/tt0944947/reviews/", {
			waitUntil: "domcontentloaded",
		});
		expect(await injectScript(page)).toBe(true);
	});

	test("TheTVDB DVD order gets no button", async ({ page }) => {
		await page.goto("https://thetvdb.com/series/game-of-thrones/seasons/dvd/3", {
			waitUntil: "domcontentloaded",
		});
		await page.waitForSelector("h1", { timeout: 30_000 });
		await injectScript(page);
		await page.waitForTimeout(3_000);
		await expect(page.locator("[data-dmm-btn-added]")).toHaveCount(0);
	});
});

// ---------------------------------------------------------------------------
// Episode pages open their season; Stremio Web
// ---------------------------------------------------------------------------
const EPISODE_PAGES = [
	["IMDb episode", "https://www.imdb.com/title/tt2178784/", "section.ipc-page-background h1 > span", `${GOT}/3`],
	["TMDB episode", "https://www.themoviedb.org/tv/1399-game-of-thrones/season/3/episode/2", "h3:has(> a.no_click.open)", `${GOT}/3`],
	["Serializd episode", "https://www.serializd.com/show/Game-of-Thrones-1399/season/3626/3/episode/2", "div.big-heading", `${GOT}/3`],
	["Metacritic episode", "https://www.metacritic.com/tv/game-of-thrones/season-3/episode-1-valar-dohaeris/", "div.hero-episode-title", `${GOT}/3`],
	["TheTVDB episode", "https://thetvdb.com/series/game-of-thrones/episodes/4517458", "h1", `${GOT}/3`],
	["Simkl episode", "https://simkl.com/tv/17465/game-of-thrones/season-3/episode-2/", "h1", `${GOT}/3`],
	["TVmaze episode", "https://www.tvmaze.com/episodes/4952/game-of-thrones-1x01-winter-is-coming", "h1", `${GOT}/1`],
	["Stremio series", "https://web.stremio.com/#/detail/series/tt0944947", "div[class*='runtime-release-info-container']", `${X_DMM}/tt0944947`],
	["Stremio movie", "https://web.stremio.com/#/detail/movie/tt15239678/tt15239678", "div[class*='runtime-release-info-container']", `${X_DMM}/tt15239678`],
];

test.describe("Episode pages and Stremio", () => {
	for (const [name, url, title, expected] of EPISODE_PAGES) {
		test(name, async ({ page, context }) => {
			await context.addCookies(IMDB_COOKIES);
			await page.goto(url, { waitUntil: "domcontentloaded" });
			await page.waitForSelector(title, { timeout: 30_000 });

			await injectAndWaitForButtons(page);
			expect(await extractDmmUrls(page)).toEqual([expected]);
		});
	}
});

// ---------------------------------------------------------------------------
// List pages: IMDb actor and calendar pages, grids, torrent-cache links
// ---------------------------------------------------------------------------

// Grid buttons open a blank tab inside the click and point it at DMM once
// the id is looked up; record where each tab is sent.
async function clickGridButtons(page, count) {
	return page.evaluate(async (count) => {
		const urls = [];
		const open = window.open;
		// MyAnimeList buttons open their URL directly; the rest send a blank tab.
		window.open = (url) => {
			if (url) urls.push(url);
			return { location: { set href(url) { urls.push(url); } }, close() {} };
		};
		[...document.querySelectorAll("button[data-dmm-grid]")]
			.slice(0, count)
			.forEach((button) => button.click());
		const deadline = Date.now() + 15_000;
		while (urls.length < count && Date.now() < deadline)
			await new Promise((resolve) => setTimeout(resolve, 200));
		window.open = open;
		return urls;
	}, count);
}

const GRID_PAGES = [
	["MyAnimeList top anime", "https://myanimelist.net/topanime.php", /^https:\/\/debridmediamanager\.com\/anime\/mal-\d+$/],
	["MyAnimeList season", "https://myanimelist.net/anime/season", /^https:\/\/debridmediamanager\.com\/anime\/mal-\d+$/],
	["TMDB popular movies", "https://www.themoviedb.org/movie", /^https:\/\/x\.debridmediamanager\.com\/tt\d+$/],
	["TMDB popular tv", "https://www.themoviedb.org/tv", /^https:\/\/x\.debridmediamanager\.com\/tt\d+$/],
	["TVmaze shows", "https://www.tvmaze.com/shows", /^https:\/\/x\.debridmediamanager\.com\/tt\d+$/],
	["AniList trending", "https://anilist.co/search/anime/trending", /^https:\/\/debridmediamanager\.com\/anime\/mal-\d+$/],
];

test.describe("List pages", () => {
	for (const [name, url, expected] of GRID_PAGES) {
		test(name, async ({ page }) => {
			await page.goto(url, { waitUntil: "domcontentloaded" });
			await injectScript(page);
			const buttons = page.locator("button[data-dmm-grid]");
			await buttons.first().waitFor({ state: "attached", timeout: 15_000 });

			// One visible button per title.
			const ids = await buttons.evaluateAll((all) =>
				all.filter((b) => b.getClientRects().length).map((b) => b.dataset.dmmGrid)
			);
			expect(ids.length).toBe(await buttons.count());
			expect(new Set(ids).size).toBe(ids.length);

			const urls = await clickGridButtons(page, 2);
			expect(urls).toHaveLength(2);
			for (const url of urls) expect(url).toMatch(expected);
		});
	}

	for (const [name, url] of [
		["IMDb actor filmography", "https://www.imdb.com/name/nm3154303/"],
		["IMDb release calendar", "https://www.imdb.com/calendar/"],
	]) {
		test(name, async ({ page, context }) => {
			await context.addCookies(IMDB_COOKIES);
			await page.goto(url, { waitUntil: "domcontentloaded" });
			await page.waitForSelector(".ipc-metadata-list-summary-item", {
				state: "attached",
				timeout: 30_000,
			});

			const btns = await injectAndWaitForButtons(page);
			expect(await btns.count()).toBeGreaterThan(10);
			const urls = await extractDmmUrls(page);
			for (const url of urls) expect(url).toMatch(/^https:\/\/x\.debridmediamanager\.com\/tt\d+$/);
		});
	}

	test("AniList cover cards get no button inside them", async ({ page }) => {
		await page.route("https://anilist.co/home", (route) =>
			route.fulfill({
				contentType: "text/html",
				body: fs.readFileSync(path.join(__dirname, "fixtures", "anilist-airing.html")),
			})
		);
		await page.goto("https://anilist.co/home");
		await injectScript(page);
		await page.waitForTimeout(500);
		expect(await page.locator(".media-preview-card button").count()).toBe(0);
	});

	// Real cards captured with their computed layout inlined (tests/fixtures).
	const serve = (page, url, fixture) =>
		page.route(url, (route) =>
			route.fulfill({
				contentType: "text/html",
				body: fs.readFileSync(path.join(__dirname, "fixtures", fixture)),
			})
		);

	test("IMDb filmography buttons sit beside the title, not on the poster", async ({ page }) => {
		await serve(page, "https://www.imdb.com/name/nm3154303/", "imdb-name-credits.html");
		await page.goto("https://www.imdb.com/name/nm3154303/");
		await injectScript(page);
		const placed = await page.$$eval(".ipc-metadata-list-summary-item button", (buttons) =>
			buttons.filter((b) => b.textContent.startsWith("DMM")).map((b) => !b.closest(".ipc-lockup-overlay"))
		);
		expect(placed).toEqual([true, true]);
	});

	for (const [name, url, fixture] of [
		["MyAnimeList episode carousel", "https://myanimelist.net/", "mal-home-episodes.html"],
		["MyAnimeList studio tiles", "https://myanimelist.net/anime/producer/11/Madhouse", "mal-studio-tiles.html"],
	]) {
		test(`${name} gets no cut-off buttons`, async ({ page }) => {
			await serve(page, url, fixture);
			await page.goto(url);
			await injectScript(page);
			await page.waitForTimeout(500);
			const clipped = await page.$$eval("button[data-dmm-grid]", (buttons) =>
				buttons.filter((b) => {
					const box = b.getBoundingClientRect();
					for (let p = b.parentElement, i = 0; p && i < 3; p = p.parentElement, i++) {
						const style = getComputedStyle(p);
						const edge = p.getBoundingClientRect();
						if (style.overflowX !== "visible" && box.right > edge.right + 1) return true;
						if (style.overflowY !== "visible" && box.bottom > edge.bottom + 1) return true;
					}
					return false;
				}).length
			);
			expect(clipped).toBe(0);
		});
	}

	test("LimeTorrents torrent-cache links", async ({ page }) => {
		await page.goto("https://www.limetorrents.lol/search/all/dune/", {
			waitUntil: "domcontentloaded",
		});
		await page.waitForSelector('a[href*=".torrent"]', { timeout: 30_000 });
		await injectScript(page);

		const urls = await page.evaluate(() => {
			const urls = [];
			const open = window.open;
			window.open = (url) => urls.push(url);
			document
				.querySelectorAll("button")
				.forEach((b) => b.textContent === "DMM🧲" && b.click());
			window.open = open;
			return urls;
		});
		expect(urls.length).toBeGreaterThan(10);
		expect(new Set(urls).size).toBe(urls.length);
		for (const url of urls)
			expect(url).toMatch(/^https:\/\/debridmediamanager\.com\/library\?addMagnet=[0-9a-f]{40}$/);
	});
});
