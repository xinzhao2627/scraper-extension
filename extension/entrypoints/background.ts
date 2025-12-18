import { sendMessage } from "./content";

export default defineBackground(() => {
	// console.log("Hello background!", { id: browser.runtime.id });

	browser.runtime.onInstalled.addListener((details) => {
		console.log("extensio installed: ", details);

		// this runs when a tab is fully rendered
		browser.tabs.onUpdated.addListener((tabId, changeInfo) => {
			try {
				if (changeInfo.status === "complete") {
					browser.tabs.get(tabId).then(async (tab) => {
						const feedback = await sendMessage(
							"retrieveHtml",
							undefined,
							tab.id
						);

						if (feedback.status != 200) {
							console.log("cant fetch HTML");
							return;
						}

						// send the subset html to springboot server
						// TODO
					});
				}
			} catch (error) {
				console.error("error onActivated: ", error);
			}
		});
	});
});
