// ==UserScript==
// @name         Debrid Media Manager
// @namespace    https://debridmediamanager.com
// @version      1.8.4
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

		if (targetElement && targetElement.hasAttribute("data-dmm-btn-added"))
			return;
		targetElement.setAttribute("data-dmm-btn-added", "true");

		const searchUrl = `${X_DMM_HOST}/${window.location.pathname
			.replaceAll("/", "")
			.substring(5)}`;
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

			const targetElement = item.querySelector("h3.ipc-title__text") || link;
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
		const searchUrl = `${X_DMM_HOST}/${imdbId}`;
		addButtonToElement(targetElement, SEARCH_BTN_LABEL, searchUrl);
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
		// Episodes: /episodes/N on the old site, ?view=episode on Trakt Web v3.
		if (
			/\/episodes\/\d/.test(location.pathname) ||
			new URLSearchParams(location.search).get("view") === "episode"
		) {
			targetElement.querySelector("button[data-dmm-trakt]")?.remove();
			targetElement.removeAttribute("data-dmm-btn-added");
			delete targetElement.dataset.dmmSlug;
			return;
		}
		const [, kind, slug] = match;
		if (targetElement.dataset.dmmSlug === slug) return;
		targetElement.dataset.dmmSlug = slug;
		targetElement.querySelector("button[data-dmm-trakt]")?.remove();

		fetch(`https://api.trakt.tv/${kind}/${slug}`, {
			headers: { "trakt-api-version": "2", "trakt-api-key": TRAKT_CLIENT_ID },
		})
			.then((res) => (res.ok ? res.json() : null))
			.then((data) => {
				const imdbId = data?.ids?.imdb;
				if (!imdbId || targetElement.dataset.dmmSlug !== slug) return;
				targetElement.setAttribute("data-dmm-btn-added", "true");
				const button = createButton(SEARCH_BTN_LABEL, `${X_DMM_HOST}/${imdbId}`);
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

	function addButtonsToJustWatchSingleTitle(imdbId, loadPath) {
		const targetElement = document.querySelector("h1");
		if (!targetElement || targetElement.dataset.dmmPath === location.pathname)
			return;
		targetElement.dataset.dmmPath = location.pathname;
		targetElement.querySelector("button[data-dmm-jw]")?.remove();
		targetElement.removeAttribute("data-dmm-btn-added");
		if (location.pathname !== loadPath) return;
		targetElement.setAttribute("data-dmm-btn-added", "true");
		const button = createButton(SEARCH_BTN_LABEL, `${X_DMM_HOST}/${imdbId}`);
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
	function addButtonsToMetacriticSingleTitle() {
		const targetElement = document.querySelector("h1");
		if (!targetElement || targetElement.hasAttribute("data-dmm-btn-added")) return;
		let imdbId = null;
		document.querySelectorAll("script:not([src])").forEach((s) => {
			if (!imdbId) {
				const match = s.textContent.match(/tt\d{5,}/);
				if (match) imdbId = match[0];
			}
		});
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
	const imdbUrl = (id) => (/^tt\d+$/.test(id ?? "") ? `${X_DMM_HOST}/${id}` : null);
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

	function traktImdbUrl(idType, id, type) {
		return getJson(`https://api.trakt.tv/search/${idType}/${id}?type=${type}`, {
			headers: { "trakt-api-version": "2", "trakt-api-key": TRAKT_CLIENT_ID },
		}).then((data) => imdbUrl(data?.[0]?.[type]?.ids?.imdb));
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
			path: /^\/(movie|tv)\/(\d+)/,
			title: "section.header .title h2",
			url: ([, kind, id]) => traktImdbUrl("tmdb", id, kind === "tv" ? "show" : "movie"),
		},
		{
			host: /^www\.serializd\.com$/,
			path: /^\/show\/[^/]*-(\d+)(?:\/|$)/,
			title: "h1.big-heading",
			url: ([, id]) => traktImdbUrl("tmdb", id, "show"),
		},
		{
			host: /^www\.tvmaze\.com$/,
			path: /^\/shows\/(\d+)/,
			title: "h1",
			url: ([, id]) =>
				getJson(`https://api.tvmaze.com/shows/${id}`).then((d) => imdbUrl(d?.externals?.imdb)),
		},
		{
			host: /^simkl\.com$/,
			path: /^\/(movies|tv|anime)\/\d+/,
			title: "h1",
			url: () => imdbUrl(pageImdbId()),
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
		const match = location.pathname.match(site.path);
		const key = match ? location.pathname : "";
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
				if (!url || targetElement.dataset.dmmKey !== key || location.pathname !== key) return;
				targetElement.setAttribute("data-dmm-btn-added", "true");
				const button = createButton(SEARCH_BTN_LABEL, url);
				button.dataset.dmmLookup = key;
				targetElement.appendChild(button);
			})
			.catch(() => {});
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

	const hostname = window.location.hostname;

	///// IMDB /////
	if (hostname === "www.imdb.com") {
		const isIMDBSingleTitlePage = /^\/title\//.test(location.pathname);
		const isIMDBListPage =
			/^\/search\//.test(location.pathname) ||
			/^\/list\/ls/.test(location.pathname);
		const isIMDBChartPage = /^\/chart\//.test(location.pathname);

		if (isIMDBSingleTitlePage) {
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
			/^\/list\/ls/.test(location.pathname);
		const isIMDBChartPage = /^\/chart\//.test(location.pathname);

		if (isIMDBSingleTitlePage) {
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

		if (isMDBListSingleTitlePage) {
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
			addButtonsToJustWatchSingleTitle(imdbId, loadPath);
			changeObserver("#app", () => addButtonsToJustWatchSingleTitle(imdbId, loadPath));
		}

		///// THETVDB /////
	} else if (hostname === "thetvdb.com") {
		if (/^\/(movies|series)\//.test(location.pathname)) {
			addButtonsToTheTVDBSingleTitle();
		}

		///// CRITICKER /////
	} else if (hostname === "www.criticker.com") {
		if (/^\/film\//.test(location.pathname)) {
			addButtonsToCritickerSingleTitle();
		}

		///// METACRITIC /////
	} else if (hostname === "www.metacritic.com") {
		if (/^\/(movie|tv)\//.test(location.pathname)) {
			addButtonsToMetacriticSingleTitle();
		}
	} else {
		const site = LOOKUP_SITES.find((s) => s.host.test(hostname));
		if (site) {
			addLookupButton(site);
			changeObserver("body", () => addLookupButton(site));
		}
	}
})();
