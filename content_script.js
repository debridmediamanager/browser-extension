// ==UserScript==
// @name         Debrid Media Manager
// @namespace    https://debridmediamanager.com
// @version      1.8.3
// @description  Add accessible DMM buttons to IMDB, MDBList, TraktTV, JustWatch, TheTVDB, Criticker, Metacritic, and Bittorrent sites with magnet links
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

	// TraktTV — classic UI + Trakt Web v3 (app.trakt.tv Svelte SPA)
	const TRAKT_EXCLUDED =
		/^\/(shows|movies)\/(trending|popular|anticipated|recommended|boxoffice|watched|collected|favorited|search)(\/|$)/;

	function isTraktHost(hostname) {
		return (
			hostname === "trakt.tv" ||
			hostname === "www.trakt.tv" ||
			hostname === "app.trakt.tv"
		);
	}

	function getTraktSlugPath() {
		const m = location.pathname.match(/^\/(movies|shows)\/([^/]+)(?:\/|$)/);
		if (!m || TRAKT_EXCLUDED.test(location.pathname)) return null;
		return { type: m[1], slug: decodeURIComponent(m[2]) };
	}

	function findTraktImdbId() {
		const selectors = [
			"a#external-link-imdb",
			'.trakt-summary-ratings a[href*="imdb.com/title/"]',
			'a[href*="imdb.com/title/"]',
		];
		for (const sel of selectors) {
			const id = document.querySelector(sel)?.href?.match(/tt\d+/)?.[0];
			if (id) return id;
		}
		const html = document.documentElement?.innerHTML || "";
		const fromJson =
			html.match(/"imdb(?:Id)?"\s*:\s*"(tt\d+)"/) ||
			html.match(/imdb\.com\/title\/(tt\d+)/);
		if (fromJson) return fromJson[1];
		return window.__DMM_TRAKT_IMDB || null;
	}

	function findTraktTitleElement() {
		return (
			document.querySelector("h1.trakt-responsive-title") ||
			document.querySelector('[data-testid="summary-media-title"]') ||
			document.querySelector(".trakt-summary-title h1") ||
			document.querySelector("#summary-wrapper div > h1") ||
			document.querySelector("h1")
		);
	}

	function traktDmmUrl(imdbId, title) {
		if (imdbId) return `${X_DMM_HOST}/${imdbId}`;
		const q = (title || "").trim();
		if (!q) return DMM_HOST;
		return `${DMM_HOST}/?search=${encodeURIComponent(q)}`;
	}

	function addButtonsToTraktTVSingleTitle() {
		if (/\/episodes\/\d/.test(location.pathname)) return;
		if (!getTraktSlugPath()) return;

		const targetElement = findTraktTitleElement();
		if (!targetElement) return;

		const imdbId = findTraktImdbId();
		const title = (targetElement.textContent || "").trim();
		const searchUrl = traktDmmUrl(imdbId, title);

		// Always show a button once we have a title; upgrade href when IMDb arrives
		let btn = targetElement.querySelector("button[data-dmm-trakt-btn]");
		if (btn) {
			if (imdbId && !btn.dataset.dmmImdb) {
				btn.dataset.dmmImdb = imdbId;
				btn.onclick = (event) => {
					event.preventDefault();
					window.open(searchUrl, "_blank");
				};
			}
			return;
		}

		targetElement.setAttribute("data-dmm-btn-added", "true");
		btn = createButton(SEARCH_BTN_LABEL, searchUrl);
		btn.setAttribute("data-dmm-trakt-btn", "1");
		if (imdbId) btn.dataset.dmmImdb = imdbId;
		targetElement.appendChild(btn);
	}

	function setupTraktTV() {
		window.addEventListener("message", (event) => {
			if (event.source !== window) return;
			const data = event.data;
			if (!data || data.source !== "dmm-trakt" || !data.imdbId) return;
			window.__DMM_TRAKT_IMDB = data.imdbId;
			addButtonsToTraktTVSingleTitle();
		});

		const run = () => addButtonsToTraktTVSingleTitle();
		run();
		changeObserver("body", run);

		const rewipe = () => {
			window.__DMM_TRAKT_IMDB = null;
			document
				.querySelectorAll("[data-dmm-btn-added], button[data-dmm-trakt-btn]")
				.forEach((el) => {
					if (el.tagName === "BUTTON" && el.hasAttribute("data-dmm-trakt-btn")) {
						el.remove();
					} else {
						el.removeAttribute("data-dmm-btn-added");
					}
				});
			setTimeout(run, 150);
			setTimeout(run, 800);
			setTimeout(run, 2000);
		};
		const wrapHist = (method) => {
			const orig = history[method];
			history[method] = function (...args) {
				const ret = orig.apply(this, args);
				rewipe();
				return ret;
			};
		};
		wrapHist("pushState");
		wrapHist("replaceState");
		window.addEventListener("popstate", rewipe);
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
	function addButtonsToJustWatchSingleTitle() {
		const targetElement = document.querySelector("h1");
		if (!targetElement || targetElement.hasAttribute("data-dmm-btn-added")) return;
		// Extract from Apollo cache in inline scripts
		let imdbId = null;
		document.querySelectorAll("script:not([src])").forEach((s) => {
			const match = s.textContent.match(/"imdbId":"(tt\d+)"/);
			if (match) imdbId = match[1];
		});
		if (!imdbId) return;
		targetElement.setAttribute("data-dmm-btn-added", "true");
		addButtonToElement(targetElement, SEARCH_BTN_LABEL, `${X_DMM_HOST}/${imdbId}`);
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
	} else if (isTraktHost(hostname)) {
		setupTraktTV();

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
		if (/\/(movie|tv-show)\//.test(location.pathname)) {
			addButtonsToJustWatchSingleTitle();
			changeObserver("#app", addButtonsToJustWatchSingleTitle);
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

	}
})();
