export default defineBackground(() => {
	// console.log("Hello background!", { id: browser.runtime.id });

	browser.runtime.onInstalled.addListener((details) => {
		console.log("extensio installed: ", details);
	});
	// this runs when a tab is fully rendered
	browser.tabs.onUpdated.addListener((tabId, changeInfo) => {
		try {
			if (changeInfo.status === "complete") {
				browser.tabs.get(tabId).then(async (tab) => {
					const url = tab.url;

					if (url && url.includes("reddit.com")) {
						const url_json = url.endsWith("/")
							? url + ".json"
							: url + "/.json";

						const response = await fetch(url_json);

						if (response.ok) {
							const result = await response.json();
							console.log(result);

							// send the json to springboot server
							// TODO
						}
					}
				});
			}
		} catch (error) {
			console.error("error onActivated: ", error);
		}
	});
});
