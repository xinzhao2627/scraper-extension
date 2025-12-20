import jsonQuery from "json-query";

function getBody(data: any, collections: string[]): string[] {
	const titleSection = data[0]["data"]["children"][0]["data"];

	const title = titleSection["title"] as string;
	if (title) collections.push(title);

	const titleBody = titleSection["selftext"] as string;
	if (titleBody) collections.push(titleBody);

	const commentsSection = data[1]["data"]["children"];

	for (const comment of commentsSection) {
		const text = comment["data"]["body"] as string;

		if (text) {
			collections.push(text);
		}
	}

	return collections;
}

export default defineBackground(() => {
	// console.log("Hello background!", { id: browser.runtime.id });

	browser.runtime.onInstalled.addListener((details) => {
		console.log("extension installed: ", details);
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
							// console.log(result);
							let collections: string[] = [];
							getBody(result, collections);

							console.log("the json: " + collections);

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
