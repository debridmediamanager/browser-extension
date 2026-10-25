// ==UserScript==
// @name         Debrid Media Manager
// @namespace    https://debridmediamanager.com
// @version      1.8.9
// @description  Add accessible DMM buttons to IMDB, MDBList, TraktTV, JustWatch, TheTVDB, Criticker, Metacritic, TMDB, Serializd, TVmaze, Simkl, Wikipedia, AniDB, MyAnimeList, AniList, Kitsu, LiveChart, and Bittorrent sites with magnet links
// @author       Ben Adrian Sarmiento <me@bensarmiento.com>
// @license      MIT
// @match        *://*/*
// @grant        none
// ==/UserScript==

(function () {
	"use strict";

	const DMM_HOST = "https://debridmediamanager.com";
	const X_DMM_HOST = "https://x.debridmediamanager.com";
	const SEARCH_BTN_LABEL = "DMM🔎";

	// A page about one season of a show opens that season on DMM.
	const dmmUrl = (imdbId, season) =>
		/^[1-9]\d*$/.test(season ?? "")
			? `${DMM_HOST}/show/${imdbId}/${season}`
			: `${X_DMM_HOST}/${imdbId}`;

	function createButton(text, url) {
		const button = document.createElement("button");
		// button.tabIndex = 0;
		// button.disabled = false;
		button.textContent = text;
		button.style.fontFamily = "'Roboto', sans-serif";
		button.style.marginLeft = "5px";
		button.style.padding = "3px 5px";
		button.style.border = "none";
		button.style.borderRadius = "3px";
		button.style.background = "#00A0B0"; // Teal color
		button.style.color = "#ECF0F1"; // Off-white color
		button.style.cursor = "pointer";
		button.style.transition = "background-color 0.3s, transform 0.1s";

		// Hover effect
		button.onmouseover = function () {
			this.style.background = "#EDC951"; // Yellow color
		};

		// Revert hover effect
		button.onmouseout = function () {
			this.style.background = "#00A0B0"; // Teal color
		};

		// Click effect
		button.onmousedown = function () {
			this.style.transform = "scale(0.95)";
			this.style.background = "#CC333F"; // Dark red color
		};

		// Revert click effect
		button.onmouseup = function () {
			this.style.transform = "scale(1)";
			this.style.background = "#EDC951"; // Yellow color (same as hover effect)
		};

		// Open new tab on click
		button.onclick = (event) => {
			event.preventDefault();
			window.open(url, "_blank");
		};

		return button;
	}

	function createLink(text, url) {
		const link = document.createElement("a");
		link.textContent = text;
		link.href = url;
		link.target = "_blank"; // Opens the link in a new tab
		link.style.display = "inline-block"; // Display as inline-block to style like a button
		link.style.fontFamily = "'Roboto', sans-serif";
		link.style.marginLeft = "5px";
		link.style.padding = "3px 5px";
		link.style.border = "none";
		link.style.borderRadius = "3px";
		link.style.background = "#00A0B0"; // Teal color
		link.style.color = "#ECF0F1"; // Off-white color
		link.style.textDecoration = "none"; // Remove underline from the link
		link.style.cursor = "pointer";

		return link;
	}

	function addButtonToElement(element, text, url) {
		const button = createButton(text, url);
		element.appendChild(button);
	}

	function addLinkToElement(element, text, url) {
		const button = createLink(text, url);
		element.appendChild(button);
	}


    function getInfoHashFromMagnetLink(magnetLink) {
        const urlParams = new URLSearchParams(magnetLink.substring(magnetLink.indexOf('?')));
        const xt = urlParams.get('xt');
        if (xt && xt.startsWith('urn:btih:')) {
            return xt.substring(9); // Remove 'urn:btih:'
        }
        return null;
    }

	// IMDB functions
	function addButtonsToIMDBSingleTitle() {
		const targetElement = document.querySelector(
			"section.ipc-page-background h1 > span"
		);

		if (!targetElement || targetElement.hasAttribute("data-dmm-btn-added"))
			return;
		targetElement.setAttribute("data-dmm-btn-added", "true");

		// An episode page names its series and "S3.E9": open that season.
		const seriesId = document
			.querySelector('[data-testid="hero-title-block__series-link"]')
			?.href?.match(/tt\d+/)?.[0];
		const season = document
			.querySelector('[data-testid="hero-subnav-bar-season-episode-numbers-section"]')
			?.textContent?.match(/S(\d+)/)?.[1];
		const searchUrl = seriesId
			? dmmUrl(seriesId, season)
			: `${X_DMM_HOST}/${window.location.pathname.replaceAll("/", "").substring(5)}`;
		addButtonToElement(targetElement, SEARCH_BTN_LABEL, searchUrl);
	}

	function addButtonsToIMDBList() {
		const items = Array.from(
			document.querySelectorAll(".ipc-metadata-list-summary-item")
		).filter((item) => !item.hasAttribute("data-dmm-btn-added"));

		items.forEach((item) => {
			const link = item.querySelector('a[href*="/title/"]');
			const imdbId = link?.href?.match(/tt\d+/)?.[0];
			if (!imdbId) return;

			item.setAttribute("data-dmm-btn-added", "true");

			// The title, never the poster overlay link that comes first.
			const targetElement =
				item.querySelector(".ipc-title") ||
				[...item.querySelectorAll('a[href*="/title/"]')].find((a) => a.textContent.trim()) ||
				link;
			const searchUrl = `${X_DMM_HOST}/${imdbId}`;
			addButtonToElement(targetElement, SEARCH_BTN_LABEL, searchUrl);
		});

		changeObserver("ul.ipc-metadata-list", addButtonsToIMDBList);
	}

	function addButtonsToIMDBChart() {
		const items = Array.from(document.querySelectorAll(".cli-title")).filter(
			(item) => !item.hasAttribute("data-dmm-btn-added")
		);

		items.forEach((item) => {
			item.setAttribute("data-dmm-btn-added", "true");

			let link = item.querySelector('a[href^="/title/"]').href;
			let imdbId = link.match(/tt\d+/)?.[0];
			if (!imdbId) return;
			const searchUrl = `${X_DMM_HOST}/${imdbId}`;

			addButtonToElement(item, SEARCH_BTN_LABEL, searchUrl);
		});

		changeObserver("ul.ipc-metadata-list", addButtonsToIMDBChart);
	}

	// MDBList functions
	function addButtonsToMDBListSingleTitle() {
		const targetElement = document.querySelector("h1.movie-hero__title");
		if (!targetElement || targetElement.hasAttribute("data-dmm-btn-added"))
			return;

		const imdbId = document.querySelector('a[href*="imdb.com/title/"]')
			?.href?.match(/tt\d+/)?.[0];
		if (!imdbId) return;

		targetElement.setAttribute("data-dmm-btn-added", "true");
		const season = location.pathname.match(/\/season\/(\d+)\/?$/)?.[1];
		addButtonToElement(targetElement, SEARCH_BTN_LABEL, dmmUrl(imdbId, season));
	}

	function addButtonsToMDBListSearchResults() {
		const items = Array.from(
			document.querySelectorAll("div.ui.centered.cards > div")
		).filter((item) => !item.hasAttribute("data-dmm-btn-added"));

		items.forEach((item) => {
			const targetElement = item.querySelector("div.header");
			if (!targetElement) return;

			const imdbId = item.querySelector('a[href*="imdb.com/title/"]')
				?.href?.match(/tt\d+/)?.[0];
			if (!imdbId) return;

			item.setAttribute("data-dmm-btn-added", "true");
			const searchUrl = `${X_DMM_HOST}/${imdbId}`;
			const button = createButton(SEARCH_BTN_LABEL, searchUrl);
			button.style.marginLeft = "0";
			button.style.marginTop = "4px";
			targetElement.insertAdjacentElement("afterend", button);
		});

		changeObserver("div.ui.centered.cards", addButtonsToMDBListSearchResults);
	}

	// TraktTV functions
	// Trakt Web v3 (app.trakt.tv) renders no IMDb id, so ask Trakt's API by
	// slug with DMM's public client id. It is a SPA: re-run on every mutation
	// and rebuild the button when the slug changes.
	const TRAKT_CLIENT_ID =
		"8a7455d06804b07fa25e27454706c6f2107b6fe5ed2ad805eff3b456a17e79f0";
	function addButtonsToTraktTVSingleTitle() {
		const match = location.pathname.match(/^\/(movies|shows)\/([^/]+)/);
		const targetElement =
			document.querySelector("h1.trakt-responsive-title") ||
			document.querySelector("#summary-wrapper div > h1");
		if (!match || !targetElement) return;
		// Episodes (?view=episode&season=N) open their season like season tabs.
		const [, kind, slug] = match;
		const season =
			kind === "shows"
				? new URLSearchParams(location.search).get("season") ??
					location.pathname.match(/\/seasons\/(\d+)/)?.[1]
				: null;
		const key = `${slug}:${season}`;
		if (targetElement.dataset.dmmSlug === key) return;
		targetElement.dataset.dmmSlug = key;
		targetElement.querySelector("button[data-dmm-trakt]")?.remove();

		fetch(`https://api.trakt.tv/${kind}/${slug}`, {
			headers: { "trakt-api-version": "2", "trakt-api-key": TRAKT_CLIENT_ID },
		})
			.then((res) => (res.ok ? res.json() : null))
			.then((data) => {
				const imdbId = data?.ids?.imdb;
				if (!imdbId || targetElement.dataset.dmmSlug !== key) return;
				targetElement.setAttribute("data-dmm-btn-added", "true");
				const button = createButton(SEARCH_BTN_LABEL, dmmUrl(imdbId, season));
				button.dataset.dmmTrakt = "true";
				targetElement.appendChild(button);
			})
			.catch(() => {});
	}

	// iCheckMovies functions
	function addButtonsToiCheckMoviesSingleTitle() {
		const imdbId = document
			.querySelector("a.optionIMDB")
			?.href?.match(/tt\d+/)?.[0];
		if (!imdbId) return;

		const targetElement = document.querySelector("#movie > h1");

		if (targetElement && targetElement.hasAttribute("data-dmm-btn-added"))
			return;
		targetElement.setAttribute("data-dmm-btn-added", "true");

		const searchUrl = `${X_DMM_HOST}/${imdbId}`;
		addButtonToElement(targetElement, SEARCH_BTN_LABEL, searchUrl);
	}

	function addButtonsToiCheckMoviesList() {
		const items = Array.from(
			document.querySelectorAll("ol#itemListMovies > li")
		).filter((item) => !item.hasAttribute("data-dmm-btn-added"));

		items.forEach((item) => {
			const imdbId = item
				.querySelector("a.optionIMDB")
				?.href?.match(/tt\d+/)?.[0];
			if (!imdbId) return;

			const targetElement = item.querySelector("h2 a");
			if (!targetElement) return;

			item.setAttribute("data-dmm-btn-added", "true");

			const searchUrl = `${X_DMM_HOST}/${imdbId}`;
			addButtonToElement(targetElement, SEARCH_BTN_LABEL, searchUrl);
		});
	}

	// JustWatch functions
	// JustWatch is Nuxt: __NUXT_DATA__ is a flat array where object values are
	// indices into it. It describes only the page that was loaded, so a title
	// reached by client-side navigation gets no button rather than a wrong one.
	function getJustWatchImdbId() {
		try {
			const data = JSON.parse(
				document.getElementById("__NUXT_DATA__")?.textContent || "[]"
			);
			const ids = new Set(
				data
					.filter((v) => v && typeof v === "object" && "imdbId" in v)
					.map((v) => data[v.imdbId])
					.filter((id) => /^tt\d+$/.test(id))
			);
			return ids.size === 1 ? [...ids][0] : null;
		} catch {
			return null;
		}
	}

	function addButtonsToJustWatchSingleTitle(url, loadPath) {
		const targetElement = document.querySelector("h1");
		if (!targetElement || targetElement.dataset.dmmPath === location.pathname)
			return;
		targetElement.dataset.dmmPath = location.pathname;
		targetElement.querySelector("button[data-dmm-jw]")?.remove();
		targetElement.removeAttribute("data-dmm-btn-added");
		if (location.pathname !== loadPath) return;
		targetElement.setAttribute("data-dmm-btn-added", "true");
		const button = createButton(SEARCH_BTN_LABEL, url);
		button.dataset.dmmJw = "true";
		targetElement.appendChild(button);
	}

	// TheTVDB functions
	function addButtonsToTheTVDBSingleTitle() {
		const targetElement = document.querySelector("h1#series_title");
		if (!targetElement || targetElement.hasAttribute("data-dmm-btn-added")) return;
		const imdbId = document.querySelector('a[href*="imdb.com/title/"]')?.href?.match(/tt\d+/)?.[0];
		if (!imdbId) return;
		targetElement.setAttribute("data-dmm-btn-added", "true");
		addButtonToElement(targetElement, SEARCH_BTN_LABEL, `${X_DMM_HOST}/${imdbId}`);
	}

	// Criticker functions
	function addButtonsToCritickerSingleTitle() {
		const targetElement = document.querySelector("h1");
		if (!targetElement || targetElement.hasAttribute("data-dmm-btn-added")) return;
		const imdbId = document.querySelector('a[href*="imdb.com/title/"]')?.href?.match(/tt\d+/)?.[0];
		if (!imdbId) return;
		targetElement.setAttribute("data-dmm-btn-added", "true");
		addButtonToElement(targetElement, SEARCH_BTN_LABEL, `${X_DMM_HOST}/${imdbId}`);
	}

	// Metacritic functions
	function getMetacriticImdbId() {
		let imdbId = null;
		document.querySelectorAll("script:not([src])").forEach((s) => {
			if (!imdbId) {
				const match = s.textContent.match(/tt\d{5,}/);
				if (match) imdbId = match[0];
			}
		});
		return imdbId;
	}

	function addButtonsToMetacriticSingleTitle() {
		const targetElement = document.querySelector("h1");
		if (!targetElement || targetElement.hasAttribute("data-dmm-btn-added")) return;
		const imdbId = getMetacriticImdbId();
		if (!imdbId) return;
		targetElement.setAttribute("data-dmm-btn-added", "true");
		addButtonToElement(targetElement, SEARCH_BTN_LABEL, `${X_DMM_HOST}/${imdbId}`);
	}

	// letterboxd functions
	function addButtonsToLetterboxdSingleTitle() {
		const imdbId = document
			.querySelector("a[data-track-action='IMDb']")
			?.href?.match(/tt\d+/)?.[0];
		if (!imdbId) return;

		const targetElement = document.querySelector("h1.headline-1");

		if (targetElement && targetElement.hasAttribute("data-dmm-btn-added"))
			return;
		targetElement.setAttribute("data-dmm-btn-added", "true");

		const searchUrl = `${X_DMM_HOST}/${imdbId}`;
		addButtonToElement(targetElement, SEARCH_BTN_LABEL, searchUrl);
	}

	// Sites that need an id looked up. Each entry names the title page path,
	// the element the button joins and how to reach the DMM page; url() returns
	// null when the page cannot say yet, so the next mutation tries again.
	const imdbUrl = (id, season) => (/^tt\d+$/.test(id ?? "") ? dmmUrl(id, season) : null);
	const animeUrl = (anidb, mal) =>
		anidb ? `${DMM_HOST}/anime/${anidb}` : mal ? `${DMM_HOST}/anime/mal-${mal}` : null;
	const getJson = (url, init) => fetch(url, init).then((res) => (res.ok ? res.json() : null));

	// The title's IMDb id when the page links exactly one.
	function pageImdbId() {
		const ids = new Set(
			Array.from(document.querySelectorAll('a[href*="imdb.com/title/tt"]'), (a) =>
				a.href.match(/tt\d+/)?.[0]
			)
		);
		return ids.size === 1 ? [...ids][0] : null;
	}

	// The first IMDb title link on another page of this site: the show page
	// of a season or episode page, which itself links only the episode.
	function imdbIdFromPage(path) {
		return fetch(path)
			.then((res) => (res.ok ? res.text() : ""))
			.then(
				(html) =>
					new DOMParser()
						.parseFromString(html, "text/html")
						.querySelector('a[href*="imdb.com/title/"]')
						?.href?.match(/tt\d+/)?.[0]
			);
	}

	function traktImdbUrl(idType, id, type, season) {
		return getJson(`https://api.trakt.tv/search/${idType}/${id}?type=${type}`, {
			headers: { "trakt-api-version": "2", "trakt-api-key": TRAKT_CLIENT_ID },
		}).then((data) => imdbUrl(data?.[0]?.[type]?.ids?.imdb, season));
	}

	// Articles link IMDb in citations too, so take the id from the article's
	// Wikidata item: a film's P345 is its tt id, a person's an nm id.
	function wikipediaUrl() {
		if (!document.querySelector('a[href*="imdb.com/title/tt"]')) return null;
		const item = document.querySelector("#t-wikibase a")?.href?.match(/Q\d+/)?.[0];
		if (!item) return null;
		return getJson(
			`https://www.wikidata.org/w/api.php?action=wbgetclaims&format=json&origin=*&property=P345&entity=${item}`
		).then((data) => {
			const ids = (data?.claims?.P345 ?? [])
				.map((claim) => claim.mainsnak?.datavalue?.value)
				.filter((id) => /^tt\d+$/.test(id));
			return ids.length === 1 ? imdbUrl(ids[0]) : null;
		});
	}

	// A TVmaze season names its show only through its episodes.
	function tvmazeUrl([, kind, id]) {
		const show = (showId, season) =>
			getJson(`https://api.tvmaze.com/shows/${showId}`).then((d) =>
				imdbUrl(d?.externals?.imdb, season)
			);
		if (kind === "shows") return show(id);
		if (kind === "episodes")
			return getJson(`https://api.tvmaze.com/episodes/${id}?embed=show`).then((ep) =>
				imdbUrl(ep?._embedded?.show?.externals?.imdb, ep?.season)
			);
		return getJson(`https://api.tvmaze.com/seasons/${id}/episodes`).then((episodes) => {
			const showId = episodes?.[0]?._links?.show?.href?.match(/\/shows\/(\d+)$/)?.[1];
			return showId ? show(showId, episodes[0].season) : null;
		});
	}

	// Season pages on sites handled above, sent through addLookupButton.
	const IMDB_EPISODES = {
		path: /^\/title\/(tt\d+)\/episodes/,
		title: "h1.ipc-title__text",
		url: ([, id]) => imdbUrl(id, new URLSearchParams(location.search).get("season")),
	};
	// Only the official order numbers seasons the way DMM does.
	const THETVDB_SEASON = {
		path: /^\/series\/([^/]+)\/seasons\/official\/(\d+)/,
		title: "h1",
		url: ([, slug, season]) =>
			imdbIdFromPage(`/series/${slug}`).then((id) => imdbUrl(id, season)),
	};
	// An episode names its official season only in the breadcrumbs.
	const THETVDB_EPISODE = {
		path: /^\/series\/([^/]+)\/episodes\/\d+/,
		title: "h1",
		url: ([, slug]) => {
			const season = document
				.querySelector('a[href*="/seasons/official/"]')
				?.getAttribute("href")
				?.match(/\/official\/(\d+)/)?.[1];
			return season
				? imdbIdFromPage(`/series/${slug}`).then((id) => imdbUrl(id, season))
				: null;
		},
	};
	const MDBLIST_EPISODE = {
		path: /^\/show\/([^/]+)\/season\/(\d+)\/episode\/\d+/,
		title: "h1.movie-hero__title",
		url: ([, slug, season]) =>
			imdbIdFromPage(`/show/${slug}`).then((id) => imdbUrl(id, season)),
	};
	const METACRITIC_SEASON = {
		path: /^\/tv\/[^/]+\/season-(\d+)\/(?:episode-[^/]+\/?)?$/,
		title: "div.hero-season-title__season, div.hero-episode-title",
		url: ([, season]) => imdbUrl(getMetacriticImdbId(), season),
	};

	function anilistUrl([, id]) {
		return getJson("https://graphql.anilist.co", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ query: `{Media(id:${id},type:ANIME){idMal}}` }),
		}).then((data) => animeUrl(null, data?.data?.Media?.idMal));
	}

	function kitsuUrl([, slug]) {
		const query = /^\d+$/.test(slug)
			? `anime/${slug}?include=mappings`
			: `anime?filter[slug]=${encodeURIComponent(slug)}&include=mappings`;
		return getJson(`https://kitsu.app/api/edge/${query}`).then((data) => {
			const mapped = (site) =>
				data?.included?.find((m) => m.attributes?.externalSite === site)?.attributes
					?.externalId;
			return animeUrl(mapped("anidb"), mapped("myanimelist/anime"));
		});
	}

	function livechartUrl() {
		const href = (selector) => document.querySelector(selector)?.href ?? "";
		return animeUrl(
			href('a[href*="anidb.net/a"]').match(/anidb\.net\/(?:anime\/|a)(\d+)/)?.[1],
			href('a[href*="myanimelist.net/anime/"]').match(/anime\/(\d+)/)?.[1]
		);
	}

	const LOOKUP_SITES = [
		{
			host: /^www\.themoviedb\.org$/,
			path: /^\/(movie|tv)\/(\d+)(?:[^/]*\/season\/(\d+)(?:\/episode\/\d+)?\/?$)?/,
			title: "section.header .title h2, h3:has(> a.no_click.open)",
			url: ([, kind, id, season]) =>
				traktImdbUrl("tmdb", id, kind === "tv" ? "show" : "movie", season),
		},
		{
			host: /^www\.serializd\.com$/,
			path: /^\/show\/[^/]*-(\d+)(?:\/season\/\d+\/(\d+)(?:\/episode\/\d+)?\/?$|\/|$)/,
			title: "h1.big-heading, div.big-heading",
			url: ([, id, season]) => traktImdbUrl("tmdb", id, "show", season),
		},
		{
			host: /^www\.tvmaze\.com$/,
			path: /^\/(shows|seasons|episodes)\/(\d+)/,
			title: "h1",
			url: tvmazeUrl,
		},
		{
			host: /^simkl\.com$/,
			// Episode pages (Simkl has no season pages) link no IMDb id.
			path: /^\/(movies|tv|anime)\/(\d+)(?:\/([^/]+)\/season-(\d+)\/episode-\d+)?/,
			title: "h1",
			url: ([, kind, id, slug, season]) =>
				season
					? imdbIdFromPage(`/${kind}/${id}/${slug}`).then((imdb) => imdbUrl(imdb, season))
					: imdbUrl(pageImdbId()),
		},
		{
			// Hash routes, #/detail/series/tt0944947; the season picker stays out of the URL.
			host: /^web\.stremio\.com$/,
			hash: true,
			path: /^#\/detail\/(?:movie|series)\/(tt\d+)/,
			title: "div[class*='runtime-release-info-container']",
			url: ([, id]) => imdbUrl(id),
		},
		{ host: /\.wikipedia\.org$/, path: /^\/wiki\//, title: "#firstHeading", url: wikipediaUrl },
		{
			host: /^anidb\.net$/,
			path: /^\/anime\/(\d+)/,
			title: "h1.anime",
			url: ([, id]) => animeUrl(id),
		},
		{
			host: /^myanimelist\.net$/,
			path: /^\/anime\/(\d+)/,
			title: "h1.title-name",
			url: ([, id]) => animeUrl(null, id),
		},
		{ host: /^anilist\.co$/, path: /^\/anime\/(\d+)/, title: "h1", url: anilistUrl },
		{
			host: /^kitsu\.app$/,
			path: /^\/anime\/([^/]+)/,
			title: "section.media--title h3",
			url: kitsuUrl,
		},
		{
			host: /^www\.livechart\.me$/,
			path: /^\/anime\/\d+/,
			title: "div.text-xl.font-medium.line-clamp-1:not(.md\\:hidden)",
			url: livechartUrl,
		},
	];

	function addLookupButton(site) {
		const here = () =>
			location.pathname + location.search + (site.hash ? location.hash : "");
		const match = (site.hash ? location.hash : location.pathname).match(site.path);
		const key = match ? here() : "";
		// Single-page sites keep the title element across navigation.
		document.querySelectorAll("button[data-dmm-lookup]").forEach((button) => {
			if (button.dataset.dmmLookup === key) return;
			const parent = button.parentElement;
			delete parent.dataset.dmmKey;
			parent.removeAttribute("data-dmm-btn-added");
			button.remove();
		});
		const targetElement = document.querySelector(site.title);
		if (!match || !targetElement || targetElement.dataset.dmmKey === key) return;

		const result = site.url(match);
		if (!result) return;
		targetElement.dataset.dmmKey = key;
		Promise.resolve(result)
			.then((url) => {
				if (
					!url ||
					targetElement.dataset.dmmKey !== key ||
					here() !== key
				)
					return;
				targetElement.setAttribute("data-dmm-btn-added", "true");
				const button = createButton(SEARCH_BTN_LABEL, url);
				button.dataset.dmmLookup = key;
				targetElement.appendChild(button);
			})
			.catch(() => {});
	}

	// List pages: a button beside each title link. MyAnimeList links name the
	// id DMM takes; the others are looked up only when the button is clicked,
	// so a page of posters costs no API calls.
	const GRID_SITES = [
		{
			host: /^www\.themoviedb\.org$/,
			link: /^\/(movie|tv)\/(\d+)[^/]*$/,
			url: ([, kind, id]) => traktImdbUrl("tmdb", id, kind === "tv" ? "show" : "movie"),
		},
		{
			host: /^www\.tvmaze\.com$/,
			link: /^\/shows\/(\d+)\/[^/]+$/,
			url: ([, id]) => tvmazeUrl([null, "shows", id]),
		},
		{ host: /^anilist\.co$/, link: /^\/anime\/(\d+)\//, url: anilistUrl },
		{
			host: /^myanimelist\.net$/,
			link: /^\/anime\/(\d+)\/[^/]+$/,
			direct: true,
			url: ([, id]) => animeUrl(null, id),
		},
	];

	function addGridButtons(grid, titlePage) {
		if (titlePage?.test(location.pathname)) return;
		document.querySelectorAll("a[href]:not([data-dmm-grid])").forEach((link) => {
			if (link.host !== location.host || link.querySelector("img")) return;
			// Covers drawn as a (lazy) background image, like AniList's airing cards.
			if (link.style.backgroundImage || link.hasAttribute("lazy")) return;
			// Hidden links (collapsed sections) wait until they are shown.
			if (!link.textContent.trim() || !link.getClientRects().length) return;
			const match = link.pathname.match(grid.link);
			if (!match) return;
			link.dataset.dmmGrid = "true";
			// Cards often link their title twice; one button per title.
			if (document.querySelector(`button[data-dmm-grid="${CSS.escape(match[0])}"]`)) return;
			const button = grid.direct
				? createButton(SEARCH_BTN_LABEL, grid.url(match))
				: createButton(SEARCH_BTN_LABEL, null);
			if (!grid.direct)
				button.onclick = (event) => {
					event.preventDefault();
					// Open the tab inside the click so it is not blocked as a popup.
					const tab = window.open("", "_blank");
					if (!tab) return;
					tab.opener = null;
					Promise.resolve(grid.url(match))
						.then((url) => (url ? (tab.location.href = url) : tab.close()))
						.catch(() => tab.close());
				};
			button.dataset.dmmGrid = match[0];
			link.insertAdjacentElement("afterend", button);
			// A title in a fixed one-line box (carousel captions, poster tiles)
			// has no room: drop the button rather than cut it off or the title.
			if (isClipped(button)) button.remove();
		});
	}

	function isClipped(element) {
		const box = element.getBoundingClientRect();
		let parent = element.parentElement;
		for (let depth = 0; depth < 3 && parent; depth++, parent = parent.parentElement) {
			const style = getComputedStyle(parent);
			const edge = parent.getBoundingClientRect();
			if (style.overflowX !== "visible" && box.right > edge.right + 1) return true;
			if (style.overflowY !== "visible" && box.bottom > edge.bottom + 1) return true;
		}
		return false;
	}

	// observer utility function
	function changeObserver(cssSelector, addBtnFn) {
		const targetNode = document.querySelector(cssSelector);
		if (!targetNode) return;
		const config = { childList: true, subtree: true };
		let debounceTimer;
		const callback = function (mutationsList, observer) {
			if (debounceTimer) {
				clearTimeout(debounceTimer);
			}
			debounceTimer = setTimeout(() => {
				// if (!targetNode) return;
				observer.disconnect();
				addBtnFn();
				observer.observe(targetNode, config);
			}, 250);
		};
		const observer = new MutationObserver(callback);
		observer.observe(targetNode, config);
	}

	function addMagnetLinkButtonToElements(elements) {
		elements.forEach(function(link) {
			const magnetURL = link.href;
			const infoHash = getInfoHashFromMagnetLink(magnetURL);
			if (infoHash) {
				const buttonURL = `https://debridmediamanager.com/library?addMagnet=${infoHash}`;
				const button = createButton("DMM🧲", buttonURL);
				link.parentNode.insertBefore(button, link.nextSibling);
			}
		});
	}

	// Main function

	const magnetLinks = document.querySelectorAll('a[href^="magnet:?"]');
	addMagnetLinkButtonToElements(magnetLinks);

	// Torrent caches name the file by its info hash; skip hashes a magnet covers.
	const magnetHashes = new Set(
		Array.from(magnetLinks, (link) => getInfoHashFromMagnetLink(link.href)?.toLowerCase())
	);
	document.querySelectorAll('a[href*=".torrent"]').forEach((link) => {
		const hash = link.href.match(/\/([a-fA-F0-9]{40})\.torrent\b/)?.[1]?.toLowerCase();
		if (!hash || magnetHashes.has(hash)) return;
		magnetHashes.add(hash);
		const button = createButton("DMM🧲", `${DMM_HOST}/library?addMagnet=${hash}`);
		link.parentNode.insertBefore(button, link.nextSibling);
	});

	const hostname = window.location.hostname;

	///// IMDB /////
	if (hostname === "www.imdb.com") {
		const isIMDBSingleTitlePage = /^\/title\//.test(location.pathname);
		const isIMDBListPage =
			/^\/search\//.test(location.pathname) ||
			/^\/list\/ls/.test(location.pathname) ||
			/^\/(name\/nm\d+|calendar)\/?$/.test(location.pathname);
		const isIMDBChartPage = /^\/chart\//.test(location.pathname);

		if (IMDB_EPISODES.path.test(location.pathname)) {
			addLookupButton(IMDB_EPISODES);
			changeObserver("body", () => addLookupButton(IMDB_EPISODES));
		} else if (isIMDBSingleTitlePage) {
			addButtonsToIMDBSingleTitle();
			changeObserver("section.ipc-page-background", addButtonsToIMDBSingleTitle);
		} else if (isIMDBListPage) {
			addButtonsToIMDBList();
		} else if (isIMDBChartPage) {
			addButtonsToIMDBChart();
		}

		///// IMDB MOBILE /////
	} else if (hostname === "m.imdb.com") {
		const isIMDBSingleTitlePage = /^\/title\//.test(location.pathname);
		const isIMDBListPage =
			/^\/search\//.test(location.pathname) ||
			/^\/list\/ls/.test(location.pathname) ||
			/^\/(name\/nm\d+|calendar)\/?$/.test(location.pathname);
		const isIMDBChartPage = /^\/chart\//.test(location.pathname);

		if (IMDB_EPISODES.path.test(location.pathname)) {
			addLookupButton(IMDB_EPISODES);
			changeObserver("body", () => addLookupButton(IMDB_EPISODES));
		} else if (isIMDBSingleTitlePage) {
			addButtonsToIMDBSingleTitle();
			changeObserver("section.ipc-page-background", addButtonsToIMDBSingleTitle);
		} else if (isIMDBListPage) {
			addButtonsToIMDBList();
		} else if (isIMDBChartPage) {
			addButtonsToIMDBChart();
		}

		///// MDBLIST /////
	} else if (hostname === "mdblist.com") {
		const isMDBListSingleTitlePage = /^\/(movie|show)\//.test(
			location.pathname
		);

		if (MDBLIST_EPISODE.path.test(location.pathname)) {
			addLookupButton(MDBLIST_EPISODE);
		} else if (isMDBListSingleTitlePage) {
			addButtonsToMDBListSingleTitle();
		} else {
			addButtonsToMDBListSearchResults();
		}

		///// TRAKT TV /////
	} else if (hostname === "trakt.tv" || hostname === "app.trakt.tv") {
		addButtonsToTraktTVSingleTitle();
		changeObserver("body", addButtonsToTraktTVSingleTitle);

		///// ICHECKMOVIES /////
	} else if (hostname === "www.icheckmovies.com") {
		const isiCheckMoviesListPage = /^\/lists\//.test(location.pathname);
		if (isiCheckMoviesListPage) {
			addButtonsToiCheckMoviesList();
		}
		const isiCheckMoviesSingleTitlePage = /^\/movies\//.test(location.pathname);
		if (isiCheckMoviesSingleTitlePage) {
			addButtonsToiCheckMoviesSingleTitle();
		}
		///// LETTERBOXD /////
	} else if (hostname === "letterboxd.com") {
		const isLetterboxdSingleTitlePage = /^\/film\//.test(location.pathname);
		if (isLetterboxdSingleTitlePage) {
			addButtonsToLetterboxdSingleTitle();
		}

		///// JUSTWATCH /////
	} else if (hostname === "www.justwatch.com") {
		// Title paths are localized (/de/Film/, /de/Serie/), so key on the data.
		const imdbId = getJustWatchImdbId();
		if (imdbId) {
			const loadPath = location.pathname;
			// Season pages: /us/tv-show/<slug>/season-3, /de/Serie/<slug>/Staffel-3
			const season = loadPath.match(/^(?:\/[^/]+){3}\/[^/]*-(\d+)\/?$/)?.[1];
			const url = dmmUrl(imdbId, season);
			addButtonsToJustWatchSingleTitle(url, loadPath);
			changeObserver("#app", () => addButtonsToJustWatchSingleTitle(url, loadPath));
		}

		///// THETVDB /////
	} else if (hostname === "thetvdb.com") {
		if (THETVDB_SEASON.path.test(location.pathname)) {
			addLookupButton(THETVDB_SEASON);
		} else if (THETVDB_EPISODE.path.test(location.pathname)) {
			addLookupButton(THETVDB_EPISODE);
		} else if (/^\/(movies|series)\//.test(location.pathname)) {
			addButtonsToTheTVDBSingleTitle();
		}

		///// CRITICKER /////
	} else if (hostname === "www.criticker.com") {
		if (/^\/film\//.test(location.pathname)) {
			addButtonsToCritickerSingleTitle();
		}

		///// METACRITIC /////
	} else if (hostname === "www.metacritic.com") {
		if (METACRITIC_SEASON.path.test(location.pathname)) {
			addLookupButton(METACRITIC_SEASON);
			changeObserver("body", () => addLookupButton(METACRITIC_SEASON));
		} else if (/^\/(movie|tv)\//.test(location.pathname)) {
			addButtonsToMetacriticSingleTitle();
		}
	} else {
		const site = LOOKUP_SITES.find((s) => s.host.test(hostname));
		const grid = GRID_SITES.find((s) => s.host.test(hostname));
		const run = () => {
			if (site) addLookupButton(site);
			if (grid) addGridButtons(grid, site?.path);
		};
		if (site || grid) {
			run();
			changeObserver("body", run);
		}
	}
})();
