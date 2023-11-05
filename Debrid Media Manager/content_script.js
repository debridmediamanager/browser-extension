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
		const searchUrl = `${X_DMM_HOST}/${window.location.pathname
			.replaceAll("/", "")
			.substring(5)}`;
		addButtonToElement(targetElement, SEARCH_BTN_LABEL, searchUrl);
	}

	function addButtonsToIMDBList() {
		const items = document.querySelectorAll("div.lister-item-content > h3");

		items.forEach((item) => {
			let link = item.querySelector('a[href^="/title/"]').href;
			let imdbId = link.split("/").slice(-2, -1)[0];
			const searchUrl = `${X_DMM_HOST}/${imdbId}`;

			addButtonToElement(item, SEARCH_BTN_LABEL, searchUrl);
		});
	}

	function addButtonsToIMDBChart(disableObserver = false) {
		const items = Array.from(document.querySelectorAll(".ipc-title")).filter(
			(e) => e.innerText.match(/\d+\./) && !e.hasAttribute("data-button-added")
		);

		items.forEach((item) => {
			let link = item.querySelector('a[href^="/title/"]').href;
			let imdbId = link.split("/").slice(-2, -1)[0];
			const searchUrl = `${X_DMM_HOST}/${imdbId}`;

			addButtonToElement(item, SEARCH_BTN_LABEL, searchUrl);
			item.setAttribute("data-button-added", "true"); // Add the data attribute
		});

		if (disableObserver) return;

		// Select the node that will be observed for mutations
		const targetNode = document.querySelector("ul.ipc-metadata-list");

		const config = { childList: true, subtree: true };

		// Debounce timer
		let debounceTimer;

		// Callback function to execute when mutations are observed
		const callback = function (mutationsList, observer) {
			if (debounceTimer) {
				clearTimeout(debounceTimer);
			}

			// Set a new timer
			debounceTimer = setTimeout(() => {
				// Call your userscript function here
				observer.disconnect();
				addButtonsToIMDBChart(true);
				observer.observe(targetNode, config);
			}, 250); // 250 ms delay
		};

		// Create an observer instance linked to the callback function
		const observer = new MutationObserver(callback);

		// Start observing the target node for configured mutations
		observer.observe(targetNode, config);
	}

	// MDBList functions
	function addButtonsToMDBListSingleTitle() {
		const targetElement = document.querySelector(
			"#content-desktop-2 > div > div:nth-child(1) > h3"
		);
		if (targetElement) {
			const searchUrl = `${DMM_HOST}${window.location.pathname}`;
			addButtonToElement(targetElement, SEARCH_BTN_LABEL, searchUrl);
		}
	}

	function addButtonsToMDBListSearchResults(disableObserver = false) {
		const items = Array.from(
			document.querySelectorAll("div.ui.centered.cards > div")
		).filter((item) => !item.hasAttribute("data-button-added"));

		items.forEach((item) => {
			const targetElement = item.querySelector("div.header");
			if (targetElement) {
				const url = targetElement.parentElement
					.querySelector("a")
					.href.replace("https://mdblist.com/", "");
				const searchUrl = `${DMM_HOST}/${url}`;
				addButtonToElement(targetElement, SEARCH_BTN_LABEL, searchUrl);
				item.setAttribute("data-button-added", "true"); // Add the data attribute
			}
		});

		if (disableObserver) return;

		// Select the node that will be observed for mutations
		const targetNode = document.querySelector("div.ui.centered.cards");

		const config = { childList: true, subtree: true };

		// Debounce timer
		let debounceTimer;

		// Callback function to execute when mutations are observed
		const callback = function (mutationsList, observer) {
			if (debounceTimer) {
				clearTimeout(debounceTimer);
			}

			// Set a new timer
			debounceTimer = setTimeout(() => {
				// Call your userscript function here
				observer.disconnect();
				addButtonsToMDBListSearchResults(true);
				observer.observe(targetNode, config);
			}, 250); // 250 ms delay
		};

		// Create an observer instance linked to the callback function
		const observer = new MutationObserver(callback);

		// Start observing the target node for configured mutations
		observer.observe(targetNode, config);
	}

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
	}
})();
