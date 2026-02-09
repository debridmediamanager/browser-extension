// @ts-check
const { defineConfig } = require("@playwright/test");

module.exports = defineConfig({
	testDir: "./tests",
	timeout: 60_000,
	retries: 2,
	workers: 1, // sequential to avoid rate-limiting from external sites
	use: {
		browserName: "chromium",
		headless: true,
		viewport: { width: 1280, height: 720 },
		ignoreHTTPSErrors: true,
		userAgent:
			"Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
		launchOptions: {
			args: ["--disable-blink-features=AutomationControlled"],
		},
	},
	projects: [
		{
			name: "chromium",
			use: { browserName: "chromium" },
		},
	],
});
