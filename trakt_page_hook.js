// Runs in page MAIN world at document_start — intercept Trakt API fetches for IMDb ids.
(function () {
	"use strict";
	if (window.__DMM_TRAKT_HOOK__) return;
	window.__DMM_TRAKT_HOOK__ = true;

	const post = (imdb) => {
		if (!imdb || !/^tt\d+$/.test(String(imdb))) return;
		window.postMessage({ source: "dmm-trakt", imdbId: String(imdb) }, "*");
	};

	const scrape = (data) => {
		if (!data || typeof data !== "object") return;
		const id =
			data.ids?.imdb ||
			data.imdbId ||
			data.movie?.ids?.imdb ||
			data.show?.ids?.imdb ||
			data.episode?.ids?.imdb;
		if (id) post(id);
		if (Array.isArray(data)) data.forEach(scrape);
	};

	const interesting = (url) =>
		url &&
		/\/(movies|shows)\//.test(url) &&
		!/\/(related|comments|lists|people|stats|videos|watching|watched|collection|translations|studios|seasons\/\d+\/episodes)/.test(
			url
		);

	if (window.fetch) {
		const orig = window.fetch.bind(window);
		window.fetch = function (...args) {
			const p = orig(...args);
			try {
				const req = args[0];
				const url =
					typeof req === "string" ? req : req && req.url ? req.url : "";
				if (interesting(url)) {
					p.then((res) => {
						try {
							res.clone().json().then(scrape).catch(() => {});
						} catch (_) {}
					}).catch(() => {});
				}
			} catch (_) {}
			return p;
		};
	}
})();
