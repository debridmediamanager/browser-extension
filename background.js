const DMM_HOST = "https://debridmediamanager.com";

function openDMMHost() {
	// In Firefox, you should use browser.tabs.create instead of chrome.tabs.create
	browser.tabs.create({ url: DMM_HOST }).then(
		() => {},
		(error) => {
			console.error(`Error: ${error}`);
		}
	);
}

// In Firefox, browser.browserAction should be used instead of browser.action
// Note that Firefox supports promises for the tabs API
if (typeof browser !== "undefined") {
	// Use browser for Firefox
	browser.browserAction.onClicked.addListener(openDMMHost);
} else {
	// Fallback to chrome for Chrome or other browsers that don't define the browser namespace
	chrome.action.onClicked.addListener(openDMMHost);
}
