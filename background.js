const DMM_HOST = "https://debridmediamanager.com";

// Check for the existence of the browser and chrome namespaces
if (typeof browser !== "undefined") {
    // Use browser for Firefox
    browser.browserAction.onClicked.addListener(() => browser.tabs.create({url: DMM_HOST}));
} else if (typeof chrome !== "undefined") {
    // Use chrome for Chrome or other browsers
    chrome.action.onClicked.addListener(() => chrome.tabs.create({url: DMM_HOST}));
}
