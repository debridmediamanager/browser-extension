#!/usr/bin/env node
// @ts-check
const { chromium } = require("@playwright/test");
const fs = require("fs");
const path = require("path");
const { injectAndWaitForButtons } = require("../tests/helpers/inject");

const ASSETS_DIR = path.resolve(__dirname, "..", "assets");

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

const TARGETS = [
	{
		name: "imdb-single-title",
		url: "https://www.imdb.com/title/tt9784708/",
		waitFor: "section.ipc-page-background h1 > span",
		cookies: IMDB_COOKIES,
	},
	{
		name: "imdb-list",
		url: "https://www.imdb.com/list/ls540852272/",
		waitFor: ".ipc-metadata-list-summary-item",
		cookies: IMDB_COOKIES,
		scroll: 300,
	},
	{
		name: "imdb-chart",
		url: "https://www.imdb.com/chart/top/",
		waitFor: ".cli-title",
		cookies: IMDB_COOKIES,
		scroll: 300,
	},
	{
		name: "mdblist-movie",
		url: "https://mdblist.com/movie/tt9466114",
		waitFor: "h1.movie-hero__title",
		waitUntil: "load",
	},
	{
		name: "mdblist-show",
		url: "https://mdblist.com/show/tt13649112",
		waitFor: "h1.movie-hero__title",
		waitUntil: "load",
	},
	{
		name: "mdblist-list",
		url: "https://mdblist.com/lists/linaspurinis/top-watched-movies-of-the-week",
		waitFor: "div.ui.centered.cards",
		waitUntil: "load",
		scroll: 300,
	},
	{
		name: "trakt-show",
		url: "https://trakt.tv/shows/fallout",
		waitFor: "#summary-wrapper div > h1",
		cdp: true,
	},
	{
		name: "trakt-movie",
		url: "https://trakt.tv/movies/ghostbusters-frozen-empire-2024",
		waitFor: "#summary-wrapper div > h1",
		cdp: true,
	},
	{
		name: "icheckmovies-single",
		url: "https://www.icheckmovies.com/movies/fight+club/",
		waitFor: "#movie > h1",
	},
	{
		name: "icheckmovies-list",
		url: "https://www.icheckmovies.com/lists/imdbs+top+250/",
		waitFor: "ol#itemListMovies > li",
		scroll: 300,
	},
	{
		name: "letterboxd-film",
		url: "https://letterboxd.com/film/the-idea-of-you-2024/",
		waitFor: "h1.headline-1",
		waitUntil: "load",
	},
	{
		name: "justwatch-movie",
		url: "https://www.justwatch.com/us/movie/dune-part-two",
		waitFor: "h1",
		waitUntil: "load",
	},
	{
		name: "thetvdb-movie",
		url: "https://thetvdb.com/movies/dune-part-two",
		waitFor: "h1#series_title",
	},
	{
		name: "thetvdb-series",
		url: "https://thetvdb.com/series/game-of-thrones",
		waitFor: "h1#series_title",
	},
	{
		name: "criticker-film",
		url: "https://www.criticker.com/film/Dune-Part-Two/",
		waitFor: "h1",
	},
	{
		name: "metacritic-movie",
		url: "https://www.metacritic.com/movie/dune-part-two/",
		waitFor: "h1",
		waitUntil: "load",
	},
];

/**
 * Dismiss cookie/consent banners before taking screenshots.
 * Checks all frames (main page + iframes) for Accept/Consent buttons,
 * then falls back to removing known CMP overlay elements from the DOM.
 */
async function dismissConsent(page) {
	// Give async consent banners time to load
	await page.waitForTimeout(2000);

	// 1. Funding Choices CMP button (direct in page DOM)
	try {
		const fcBtn = page.locator(".fc-cta-consent");
		if (await fcBtn.isVisible({ timeout: 500 })) {
			await fcBtn.click();
			await page.waitForTimeout(500);
		}
	} catch {}

	// 2. Search ALL frames for Accept/Consent buttons (catches SourcePoint,
	//    Didomi, Quantcast, and other iframe-based CMPs)
	for (const frame of page.frames()) {
		try {
			const btn = frame
				.getByRole("button", { name: /^(Accept|Consent)$/i })
				.first();
			if (await btn.isVisible({ timeout: 500 })) {
				await btn.click();
				await page.waitForTimeout(500);
			}
		} catch {}
	}

	// 3. Simple cookie bars — dismiss link/span/button with "Got it" text
	try {
		const gotIt = page.getByText("Got it!", { exact: true }).first();
		if (await gotIt.isVisible({ timeout: 500 })) {
			await gotIt.click();
			await page.waitForTimeout(500);
		}
	} catch {}

	// 4. Fallback: brute-force remove known consent overlay elements
	await page.evaluate(() => {
		const sels = [
			".fc-consent-root",
			".fc-dialog-overlay",
			'[id^="sp_message_container"]',
			".sp_veil",
			"#qc-cmp2-ui",
			"#qc-cmp2-container",
		];
		for (const s of sels) {
			document.querySelectorAll(s).forEach((el) => el.remove());
		}
		document.body.style.removeProperty("overflow");
		document.documentElement.style.removeProperty("overflow");
	});
}

async function captureScreenshot(target, browser) {
	const context = browser.contexts()[0] || await browser.newContext();
	const page = await context.newPage();
	try {
		if (target.cookies) {
			await context.addCookies(target.cookies);
		}

		await page.goto(target.url, {
			waitUntil: target.waitUntil || "domcontentloaded",
			timeout: 45_000,
		});

		await page.waitForSelector(target.waitFor, { timeout: 30_000 });
		await dismissConsent(page);
		await injectAndWaitForButtons(page);

		if (target.scroll) {
			await page.evaluate((y) => window.scrollBy(0, y), target.scroll);
		}

		await page.waitForTimeout(500);

		const outPath = path.join(ASSETS_DIR, `${target.name}.png`);
		await page.screenshot({ path: outPath });
		return { name: target.name, ok: true };
	} catch (err) {
		return { name: target.name, ok: false, error: err.message };
	} finally {
		await page.close();
	}
}

async function main() {
	fs.mkdirSync(ASSETS_DIR, { recursive: true });

	const standardTargets = TARGETS.filter((t) => !t.cdp);
	const cdpTargets = TARGETS.filter((t) => t.cdp);
	const results = [];

	// Standard Playwright browser
	const browser = await chromium.launch({
		headless: true,
		args: ["--disable-blink-features=AutomationControlled"],
	});
	const context = await browser.newContext({
		viewport: { width: 1280, height: 800 },
		ignoreHTTPSErrors: true,
		userAgent:
			"Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
	});

	for (const target of standardTargets) {
		console.log(`Capturing ${target.name}...`);
		const page = await context.newPage();
		try {
			if (target.cookies) {
				await context.addCookies(target.cookies);
			}
			await page.goto(target.url, {
				waitUntil: target.waitUntil || "domcontentloaded",
				timeout: 45_000,
			});
			await page.waitForSelector(target.waitFor, { timeout: 30_000 });
			await dismissConsent(page);
			await injectAndWaitForButtons(page);
			if (target.scroll) {
				await page.evaluate((y) => window.scrollBy(0, y), target.scroll);
			}
			await page.waitForTimeout(500);
			const outPath = path.join(ASSETS_DIR, `${target.name}.png`);
			await page.screenshot({ path: outPath });
			results.push({ name: target.name, ok: true });
			console.log(`  ✓ ${target.name}`);
		} catch (err) {
			results.push({ name: target.name, ok: false, error: err.message });
			console.log(`  ✗ ${target.name}: ${err.message}`);
		} finally {
			await page.close();
		}
	}
	await browser.close();

	// CDP browser for Trakt
	if (cdpTargets.length > 0) {
		let cdpBrowser;
		try {
			cdpBrowser = await chromium.connectOverCDP("http://127.0.0.1:9222");
			console.log("Connected to CDP browser for Trakt screenshots");
		} catch {
			console.log(
				"⚠ CDP not available at 127.0.0.1:9222 — skipping Trakt screenshots"
			);
			console.log(
				"  To capture Trakt, launch Chrome with: google-chrome-stable --remote-debugging-port=9222"
			);
			for (const target of cdpTargets) {
				results.push({
					name: target.name,
					ok: false,
					error: "CDP not available",
				});
			}
		}

		if (cdpBrowser) {
			for (const target of cdpTargets) {
				console.log(`Capturing ${target.name} (CDP)...`);
				const result = await captureScreenshot(target, cdpBrowser);
				results.push(result);
				console.log(
					result.ok
						? `  ✓ ${target.name}`
						: `  ✗ ${target.name}: ${result.error}`
				);
			}
			await cdpBrowser.close();
		}
	}

	// Summary
	const passed = results.filter((r) => r.ok).length;
	const failed = results.filter((r) => !r.ok).length;
	console.log(`\nDone: ${passed} captured, ${failed} failed`);
	if (failed > 0) {
		console.log("Failed:");
		for (const r of results.filter((r) => !r.ok)) {
			console.log(`  - ${r.name}: ${r.error}`);
		}
	}

	process.exit(failed > 0 ? 1 : 0);
}

main();
