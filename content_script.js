// ==UserScript==
// @name         Debrid Media Manager (Fixed MDBList URLs)
// @namespace    https://debridmediamanager.com
// @version      1.6.4
// @description  Add accessible DMM buttons to IMDB, MDBList, AniDB, TraktTV, and Bittorrent sites with magnet links
// @author       Adam McGready + fixes
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
    button.textContent = text;
    button.style.fontFamily = "'Roboto', sans-serif";
    button.style.marginLeft = "5px";
    button.style.padding = "3px 5px";
    button.style.border = "none";
    button.style.borderRadius = "3px";
    button.style.background = "#00A0B0";
    button.style.color = "#ECF0F1";
    button.style.cursor = "pointer";
    button.style.transition = "background-color 0.3s, transform 0.1s";

    button.onmouseover = function () {
      this.style.background = "#EDC951";
    };
    button.onmouseout = function () {
      this.style.background = "#00A0B0";
    };
    button.onmousedown = function () {
      this.style.transform = "scale(0.95)";
      this.style.background = "#CC333F";
    };
    button.onmouseup = function () {
      this.style.transform = "scale(1)";
      this.style.background = "#EDC951";
    };

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
    link.target = "_blank";
    link.style.display = "inline-block";
    link.style.fontFamily = "'Roboto', sans-serif";
    link.style.marginLeft = "5px";
    link.style.padding = "3px 5px";
    link.style.border = "none";
    link.style.borderRadius = "3px";
    link.style.background = "#00A0B0";
    link.style.color = "#ECF0F1";
    link.style.textDecoration = "none";
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
    const urlParams = new URLSearchParams(magnetLink.substring(magnetLink.indexOf("?")));
    const xt = urlParams.get("xt");
    if (xt && xt.startsWith("urn:btih:")) return xt.substring(9);
    return null;
  }

  // Robust IMDb ID extraction (MDBList often does not expose it in the pathname)
  function extractImdbIdFromNode(root) {
    if (!root) return null;

    // 1) Any explicit IMDb link
    const a = root.querySelector?.('a[href*="imdb.com/title/tt"]') || null;
    const href = a?.href || "";
    const m1 = href.match(/tt\d{6,10}/);
    if (m1) return m1[0];

    // 2) Common data-* attributes
    const elWithData =
      root.querySelector?.("[data-imdb],[data-imdbid],[data-imdb-id]") || null;
    if (elWithData) {
      const v =
        elWithData.getAttribute("data-imdb") ||
        elWithData.getAttribute("data-imdbid") ||
        elWithData.getAttribute("data-imdb-id");
      const m2 = (v || "").match(/tt\d{6,10}/);
      if (m2) return m2[0];
    }

    // 3) Fallback: search markup text for a tt-id
    const html = root.innerHTML || "";
    const m3 = html.match(/tt\d{6,10}/);
    if (m3) return m3[0];

    // 4) Last resort: search visible text
    const text = root.textContent || "";
    const m4 = text.match(/tt\d{6,10}/);
    if (m4) return m4[0];

    return null;
  }

  function getImdbIdFromDocument() {
    // Prefer explicit IMDb external link if present
    const a =
      document.querySelector('a[href*="imdb.com/title/tt"]') ||
      document.querySelector("a#external-link-imdb") ||
      null;
    const href = a?.href || "";
    const m = href.match(/tt\d{6,10}/);
    if (m) return m[0];

    return extractImdbIdFromNode(document.body);
  }

  // IMDB
  function addButtonsToIMDBSingleTitle() {
    const targetElement = document.querySelector("section.ipc-page-background h1 > span");
    if (targetElement && targetElement.hasAttribute("data-dmm-btn-added")) return;
    if (!targetElement) return;

    targetElement.setAttribute("data-dmm-btn-added", "true");

    const searchUrl = `${X_DMM_HOST}/${window.location.pathname.replaceAll("/", "").substring(5)}`;
    addButtonToElement(targetElement, SEARCH_BTN_LABEL, searchUrl);
  }

  function addButtonsToIMDBList() {
    const items = Array.from(
      document.querySelectorAll(".lister-item .lister-item-header, .lister-item .media")
    ).filter((item) => !item.hasAttribute("data-dmm-btn-added"));

    items.forEach((item) => {
      item.setAttribute("data-dmm-btn-added", "true");

      const link = item.querySelector('a[href^="/title/"]')?.href;
      const imdbId = link?.match(/tt\d+/)?.[0];
      if (!imdbId) return;

      const searchUrl = `${X_DMM_HOST}/${imdbId}`;
      addButtonToElement(item, SEARCH_BTN_LABEL, searchUrl);
    });

    changeObserver("ul.ipc-metadata-list", addButtonsToIMDBList);
  }

  function addButtonsToIMDBChart() {
    const items = Array.from(document.querySelectorAll(".cli-title")).filter(
      (item) => item.innerText.match(/\d+\./) && !item.hasAttribute("data-dmm-btn-added")
    );

    items.forEach((item) => {
      item.setAttribute("data-dmm-btn-added", "true");

      const link = item.querySelector('a[href^="/title/"]')?.href;
      const imdbId = link?.match(/tt\d+/)?.[0];
      if (!imdbId) return;

      const searchUrl = `${X_DMM_HOST}/${imdbId}`;
      addButtonToElement(item, SEARCH_BTN_LABEL, searchUrl);
    });

    changeObserver("ul.ipc-metadata-list", addButtonsToIMDBChart);
  }

  // MDBList (FIXED: always route to x.debridmediamanager.com/<tt...>, never /show/<slug>/...)
  function addButtonsToMDBListSingleTitle() {
    const targetElement = document.querySelector("#content-desktop-2 > div > div:nth-child(1) > h3");
    if (targetElement && targetElement.hasAttribute("data-dmm-btn-added")) return;
    if (!targetElement) return;

    targetElement.setAttribute("data-dmm-btn-added", "true");

    const imdbId = getImdbIdFromDocument();
    if (!imdbId) return; // no valid DMM target without an ID

    const searchUrl = `${X_DMM_HOST}/${imdbId}`;
    addButtonToElement(targetElement, SEARCH_BTN_LABEL, searchUrl);
  }

  function addButtonsToMDBListSearchResults() {
    const items = Array.from(document.querySelectorAll("div.ui.centered.cards > div")).filter(
      (item) => !item.hasAttribute("data-dmm-btn-added")
    );

    items.forEach((item) => {
      item.setAttribute("data-dmm-btn-added", "true");

      const targetElement = item.querySelector("div.header");
      if (!targetElement) return;

      const imdbId = extractImdbIdFromNode(item);
      if (!imdbId) return;

      const searchUrl = `${X_DMM_HOST}/${imdbId}`;
      addButtonToElement(targetElement, SEARCH_BTN_LABEL, searchUrl);
    });

    changeObserver("div.ui.centered.cards", addButtonsToMDBListSearchResults);
  }

  // AniDB
  function addButtonsToAniDBSingleTitle() {
    const targetElement = document.querySelector("#layout-main > h1.anime");
    if (targetElement && targetElement.hasAttribute("data-dmm-btn-added")) return;
    if (!targetElement) return;

    targetElement.setAttribute("data-dmm-btn-added", "true");

    const searchUrl = `${DMM_HOST}/${window.location.pathname
      .replaceAll("/", "")
      .replace("anime", "anime/anidb-")}`;
    addButtonToElement(targetElement, SEARCH_BTN_LABEL, searchUrl);
  }

  function addButtonsToAniDBAnyPage() {
    const items = Array.from(document.querySelectorAll("a")).filter(
      (item) =>
        item.innerText.trim() &&
        /\/anime\/\d+$/.test(item.href) &&
        !item.hasAttribute("data-dmm-btn-added")
    );

    items.forEach((item) => {
      item.setAttribute("data-dmm-btn-added", "true");

      const searchUrl = `${DMM_HOST}/${item.href
        .replace("https://anidb.net/", "")
        .replaceAll("/", "")
        .replace("anime", "anime/anidb-")}`;

      addButtonToElement(item, SEARCH_BTN_LABEL, searchUrl);
    });
  }

  // TraktTV
  function addButtonsToTraktTVSingleTitle() {
    const targetElement = document.querySelector("#summary-wrapper div > h1");
    if (targetElement && targetElement.hasAttribute("data-dmm-btn-added")) return;
    if (!targetElement) return;

    const imdbId = document.querySelector("a#external-link-imdb")?.href?.match(/tt\d+/)?.[0];
    if (!imdbId) return;

    targetElement.setAttribute("data-dmm-btn-added", "true");

    const searchUrl = `${X_DMM_HOST}/${imdbId}`;
    addButtonToElement(targetElement, SEARCH_BTN_LABEL, searchUrl);
  }

  // iCheckMovies
  function addButtonsToiCheckMoviesSingleTitle() {
    const imdbId = document.querySelector("a.optionIMDB")?.href?.match(/tt\d+/)?.[0];
    if (!imdbId) return;

    const targetElement = document.querySelector("#movie > h1");
    if (targetElement && targetElement.hasAttribute("data-dmm-btn-added")) return;
    if (!targetElement) return;

    targetElement.setAttribute("data-dmm-btn-added", "true");

    const searchUrl = `${X_DMM_HOST}/${imdbId}`;
    addButtonToElement(targetElement, SEARCH_BTN_LABEL, searchUrl);
  }

  function addButtonsToiCheckMoviesBetaSingleTitle() {
    const imdbId = document.querySelector("a.stat-imdb")?.href?.match(/tt\d+/)?.[0];
    if (!imdbId) return;

    const targetElement = document.querySelector("h1.title");
    if (targetElement && targetElement.hasAttribute("data-dmm-btn-added")) return;
    if (!targetElement) return;

    targetElement.setAttribute("data-dmm-btn-added", "true");

    const searchUrl = `${X_DMM_HOST}/${imdbId}`;
    addLinkToElement(targetElement, SEARCH_BTN_LABEL, searchUrl);
  }

  function addButtonsToiCheckMoviesList() {
    const items = Array.from(document.querySelectorAll("ol#itemListMovies > li")).filter(
      (item) => !item.hasAttribute("data-dmm-btn-added")
    );

    items.forEach((item) => {
      const imdbId = item.querySelector("a.optionIMDB")?.href?.match(/tt\d+/)?.[0];
      if (!imdbId) return;

      const targetElement = item.querySelector("h2 a");
      if (!targetElement) return;

      item.setAttribute("data-dmm-btn-added", "true");

      const searchUrl = `${X_DMM_HOST}/${imdbId}`;
      addButtonToElement(targetElement, SEARCH_BTN_LABEL, searchUrl);
    });
  }

  function addButtonsToiCheckMoviesBetaList() {
    const items = Array.from(document.querySelectorAll("div.media-content")).filter(
      (item) => !item.hasAttribute("data-dmm-btn-added")
    );

    items.forEach((item) => {
      const imdbId = item.querySelector("a.stat-imdb")?.href?.match(/tt\d+/)?.[0];
      if (!imdbId) return;

      const targetElement = item.querySelector("h3.title");
      if (!targetElement) return;

      item.setAttribute("data-dmm-btn-added", "true");

      const searchUrl = `${X_DMM_HOST}/${imdbId}`;
      addButtonToElement(targetElement, SEARCH_BTN_LABEL, searchUrl);
    });

    changeObserver("#app section.section div.columns", addButtonsToiCheckMoviesBetaList);
  }

  // Letterboxd
  function addButtonsToLetterboxdSingleTitle() {
    const imdbId = document
      .querySelector("a[data-track-action='IMDb']")
      ?.href?.match(/tt\d+/)?.[0];
    if (!imdbId) return;

    const targetElement = document.querySelector("h1.filmtitle");
    if (targetElement && targetElement.hasAttribute("data-dmm-btn-added")) return;
    if (!targetElement) return;

    targetElement.setAttribute("data-dmm-btn-added", "true");

    const searchUrl = `${X_DMM_HOST}/${imdbId}`;
    addButtonToElement(targetElement, SEARCH_BTN_LABEL, searchUrl);
  }

  // observer utility
  function changeObserver(cssSelector, addBtnFn) {
    const targetNode = document.querySelector(cssSelector);
    if (!targetNode) return;

    const config = { childList: true, subtree: true };
    let debounceTimer;

    const callback = function (mutationsList, observer) {
      if (debounceTimer) clearTimeout(debounceTimer);

      debounceTimer = setTimeout(() => {
        observer.disconnect();
        addBtnFn();
        observer.observe(targetNode, config);
      }, 250);
    };

    const observer = new MutationObserver(callback);
    observer.observe(targetNode, config);
  }

  function addMagnetLinkButtonToElements(elements) {
    elements.forEach(function (link) {
      const magnetURL = link.href;
      const infoHash = getInfoHashFromMagnetLink(magnetURL);
      if (!infoHash) return;

      const buttonURL = `https://debridmediamanager.com/library?addMagnet=${infoHash}`;
      const button = createButton("DMM🧲", buttonURL);
      link.parentNode.insertBefore(button, link.nextSibling);
    });
  }

  // Main
  const magnetLinks = document.querySelectorAll('a[href^="magnet:?"]');
  addMagnetLinkButtonToElements(magnetLinks);

  const hostname = window.location.hostname;

  // IMDB
  if (hostname === "www.imdb.com" || hostname === "m.imdb.com") {
    const isIMDBSingleTitlePage = /^\/title\//.test(location.pathname);
    const isIMDBListPage = /^\/search\//.test(location.pathname) || /^\/list\/ls/.test(location.pathname);
    const isIMDBChartPage = /^\/chart\//.test(location.pathname);

    if (isIMDBSingleTitlePage) addButtonsToIMDBSingleTitle();
    else if (isIMDBListPage) addButtonsToIMDBList();
    else if (isIMDBChartPage) addButtonsToIMDBChart();

    // MDBList
  } else if (hostname === "mdblist.com") {
    const isMDBListSingleTitlePage = /^\/(movie|show)\//.test(location.pathname);
    if (isMDBListSingleTitlePage) addButtonsToMDBListSingleTitle();
    else addButtonsToMDBListSearchResults();

    // AniDB
  } else if (hostname === "anidb.net") {
    const isAniDBSingleTitlePage = /^\/anime\/\d+/.test(location.pathname);
    if (isAniDBSingleTitlePage) addButtonsToAniDBSingleTitle();
    addButtonsToAniDBAnyPage();

    // Trakt
  } else if (hostname === "trakt.tv") {
    const isTraktTVEpisodePage = /\/episodes\/\d/.test(location.pathname);
    if (isTraktTVEpisodePage) return;

    const isTraktTVSinglePage = /^\/(shows|movies)\/.+/.test(location.pathname);
    if (isTraktTVSinglePage) addButtonsToTraktTVSingleTitle();

    // iCheckMovies
  } else if (hostname === "www.icheckmovies.com") {
    const isiCheckMoviesListPage = /^\/lists\//.test(location.pathname);
    if (isiCheckMoviesListPage) addButtonsToiCheckMoviesList();

    const isiCheckMoviesSingleTitlePage = /^\/movies\//.test(location.pathname);
    if (isiCheckMoviesSingleTitlePage) addButtonsToiCheckMoviesSingleTitle();

  } else if (hostname === "beta.icheckmovies.com") {
    const isiCheckMoviesListPage = /^\/lists\//.test(location.pathname);
    if (isiCheckMoviesListPage) addButtonsToiCheckMoviesBetaList();

    const isiCheckMoviesSingleTitlePage = /^\/movies\//.test(location.pathname);
    if (isiCheckMoviesSingleTitlePage) addButtonsToiCheckMoviesBetaSingleTitle();

    // Letterboxd
  } else if (hostname === "letterboxd.com") {
    const isLetterboxdSingleTitlePage = /^\/film\//.test(location.pathname);
    if (isLetterboxdSingleTitlePage) addButtonsToLetterboxdSingleTitle();
  }
})();
