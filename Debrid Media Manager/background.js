const DMM_HOST = "https://debridmediamanager.com";

function openDMMHost() {
	const creatingTab = chrome.tabs.create({ url: DMM_HOST });
	creatingTab.then(
		() => {},
		(error) => {
			console.error(error);
		}
	);
}

// Check if the browser object is available and fallback to chrome if it's not
const browserAction =
	typeof browser === "object" ? browser.action : chrome.action;

// Add the listener for the browser action
browserAction.onClicked.addListener(openDMMHost);
