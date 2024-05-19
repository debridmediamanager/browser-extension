(function () {
	"use strict";
	const DMM_HOST = "https://debridmediamanager.com";
	const X_DMM_HOST = "https://x.debridmediamanager.com";
	const SEARCH_BTN_LABEL = "DMM🔎";

	function createButton(text, url) {
		const button = document.createElement("button");
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

	function addButtonToElement(element, text, url) {
		const button = createButton(text, url);
		element.appendChild(button);
	}

	// IMDB functions
	function addButtonsToIMDBSingleTitle() {
		const targetElement = document.querySelector(
			"section.ipc-page-background h1 > span"
		);

		if (targetElement && targetElement.hasAttribute('data-dmm-btn-added')) return;
		targetElement.setAttribute('data-dmm-btn-added', 'true');

		const searchUrl = `${X_DMM_HOST}/${window.location.pathname
			.replaceAll("/", "")
			.substring(5)}`;
		addButtonToElement(targetElement, SEARCH_BTN_LABEL, searchUrl);
	}

	function addButtonsToIMDBList() {
		const items = document.querySelectorAll(".lister-item-header, .dli-title");

		items.forEach((item) => {

			if (item && item.hasAttribute('data-dmm-btn-added')) return;
			item.setAttribute('data-dmm-btn-added', 'true');

			let link = item.querySelector('a[href^="/title/"]').href;
			let imdbId = link.split("/").slice(-2, -1)[0];
			const searchUrl = `${X_DMM_HOST}/${imdbId}`;

			addButtonToElement(item, SEARCH_BTN_LABEL, searchUrl);
		});

		changeObserver("ul.ipc-metadata-list", addButtonsToIMDBList);
	}

	function addButtonsToIMDBChart() {
		const items = Array.from(document.querySelectorAll(".cli-title")).filter(
			(e) => e.innerText.match(/\d+\./) && !e.hasAttribute("data-button-added")
		);

		items.forEach((item) => {

			if (item && item.hasAttribute('data-dmm-btn-added')) return;
			item.setAttribute('data-dmm-btn-added', 'true');

			let link = item.querySelector('a[href^="/title/"]').href;
			let imdbId = link.split("/").slice(-2, -1)[0];
			const searchUrl = `${X_DMM_HOST}/${imdbId}`;

			addButtonToElement(item, SEARCH_BTN_LABEL, searchUrl);
		});

		changeObserver("ul.ipc-metadata-list", addButtonsToIMDBChart);
	}

	// MDBList functions
	function addButtonsToMDBListSingleTitle() {
		const targetElement = document.querySelector(
			"#content-desktop-2 > div > div:nth-child(1) > h3"
		);

		if (targetElement && targetElement.hasAttribute('data-dmm-btn-added')) return;
		targetElement.setAttribute('data-dmm-btn-added', 'true');

		const searchUrl = `${DMM_HOST}${window.location.pathname}`;
		addButtonToElement(targetElement, SEARCH_BTN_LABEL, searchUrl);
	}

	function addButtonsToMDBListSearchResults() {
		const items = Array.from(
			document.querySelectorAll("div.ui.centered.cards > div")
		).filter((item) => !item.hasAttribute("data-button-added"));

		items.forEach((item) => {

			if (item && item.hasAttribute('data-dmm-btn-added')) return;
			item.setAttribute('data-dmm-btn-added', 'true');

			const targetElement = item.querySelector("div.header");
			if (targetElement) {
				const url = targetElement.parentElement
					.querySelector("a")
					.href.replace("https://mdblist.com/", "");
				const searchUrl = `${DMM_HOST}/${url}`;
				addButtonToElement(targetElement, SEARCH_BTN_LABEL, searchUrl);
			}
		});

		changeObserver("div.ui.centered.cards", addButtonsToMDBListSearchResults);
	}

	// AniDB functions
	function addButtonsToAniDBSingleTitle() {
		const targetElement = document.querySelector(
			"#layout-main > h1.anime"
		);

		if (targetElement && targetElement.hasAttribute('data-dmm-btn-added')) return;
		targetElement.setAttribute('data-dmm-btn-added', 'true');

		const searchUrl = `${DMM_HOST}/${window.location.pathname
			.replaceAll("/", "")
			.replace('anime', 'anime/anidb-')}`;
		addButtonToElement(targetElement, SEARCH_BTN_LABEL, searchUrl);
	}

	function addButtonsToAniDBAnyPage() {
		const items = Array.from(document.querySelectorAll("a"));

		items
			.filter(item => /anime\/\d+$/.test(item.href) && item.innerText && !item.hasAttribute('data-dmm-btn-added'))
			.forEach((item) => {
				item.setAttribute('data-dmm-btn-added', 'true');

				const searchUrl = `${DMM_HOST}/${item.href
					.replace('https://anidb.net/', '')
					.replaceAll("/", "")
					.replace('anime', 'anime/anidb-')}`;

				addButtonToElement(item, SEARCH_BTN_LABEL, searchUrl);
			});
	}

	// TraktTV functions
	function addButtonsToTraktTVSingleTitle() {
		const targetElement = document.querySelector(
			"#summary-wrapper div > h1"
		);

		if (targetElement && targetElement.hasAttribute('data-dmm-btn-added')) return;
		// find imdb id in page, <a data-type="imdb">
		const imdbId = document.querySelector('a#external-link-imdb')?.href?.split('/').pop();
		if (!imdbId) return;

		targetElement.setAttribute('data-dmm-btn-added', 'true');

		const searchUrl = `${DMM_HOST}/${window.location.pathname
			.replace("/movies/", "/movie/")
			.replace("/shows/", "/show/")}${imdbId}`;
		addButtonToElement(targetElement, SEARCH_BTN_LABEL, searchUrl);
	}

	// observer utility function
	function changeObserver(cssSelector, addBtnFn) {
		const targetNode = document.querySelector(cssSelector);
		const config = { childList: true, subtree: true };
		let debounceTimer;
		const callback = function (mutationsList, observer) {
			if (debounceTimer) {
				clearTimeout(debounceTimer);
			}
			debounceTimer = setTimeout(() => {
				observer.disconnect();
				addBtnFn();
				observer.observe(targetNode, config);
			}, 250);
		};
		const observer = new MutationObserver(callback);
		observer.observe(targetNode, config);
	}

	// Main function

	const hostname = window.location.hostname;

	if (hostname === "www.imdb.com") {
		const isIMDBSingleTitlePage = /^\/title\//.test(location.pathname);
		const isIMDBListPage =
			/^\/search\//.test(location.pathname) ||
			/^\/list\/ls/.test(location.pathname);
		const isIMDBChartPage = /^\/chart\//.test(location.pathname);

		if (isIMDBSingleTitlePage) {
			addButtonsToIMDBSingleTitle();
		} else if (isIMDBListPage) {
			addButtonsToIMDBList();
		} else if (isIMDBChartPage) {
			addButtonsToIMDBChart();
		}
	} else if (hostname === "mdblist.com") {
		const isMDBListSingleTitlePage = /^\/(movie|show)\//.test(
			location.pathname
		);

		if (isMDBListSingleTitlePage) {
			addButtonsToMDBListSingleTitle();
		} else {
			addButtonsToMDBListSearchResults();
		}
	} else if (hostname === "m.imdb.com") {
		console.log('m.imdb.com')
		const isIMDBSingleTitlePage = /^\/title\//.test(location.pathname);
		const isIMDBListPage =
			/^\/search\//.test(location.pathname) ||
			/^\/list\/ls/.test(location.pathname);
		const isIMDBChartPage = /^\/chart\//.test(location.pathname);

		if (isIMDBSingleTitlePage) {
			addButtonsToIMDBSingleTitle();
		} else if (isIMDBListPage) {
			addButtonsToIMDBList();
		} else if (isIMDBChartPage) {
			addButtonsToIMDBChart();
		}
	} else if (hostname === "anidb.net") {
		const isAniDBSingleTitlePage = /^\/anime\/\d+/.test(
			location.pathname
		);

		if (isAniDBSingleTitlePage) {
			addButtonsToAniDBSingleTitle();
		}
		addButtonsToAniDBAnyPage();
	} else if (hostname === "trakt.tv") {
		const isTraktTVSinglePage = /^\/(shows|movies)\/.+/.test(
			location.pathname
		);

		if (isTraktTVSinglePage) {
			addButtonsToTraktTVSingleTitle();
		}
	}
})();
