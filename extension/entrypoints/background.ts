import jsonQuery from "json-query";
function recursive_replies_fetcher(replies: any, collections: string[]) {
	if (!replies) {
		return;
	}
	const REMOVED = "[removed]";
	const DELETED = "[deleted]";

	const bodySection = replies["data"]["children"];

	for (const b of bodySection) {
		const data = b["data"];
		const text = data["body"];

		if (text && text !== REMOVED && text !== DELETED) {
			collections.push(text);
		}

		// if a reply has a reply, loop it
		if (data["replies"]) {
			recursive_replies_fetcher(data["replies"], collections);
		}
	}
}
function getBody(data: any, collections: string[]): string[] {
	const REMOVED = "[removed]";
	const DELETED = "[deleted]";
	const titleSection = data[0]["data"]["children"][0]["data"];

	const title = titleSection["title"] as string;
	if (title) collections.push(title);

	const titleBody = titleSection["selftext"] as string;
	if (titleBody) collections.push(titleBody);

	const commentsSection = data[1]["data"]["children"];

	for (const comment of commentsSection) {
		const text = comment["data"]["body"] as string;

		const replies = comment["data"]["replies"];

		if (replies) {
			recursive_replies_fetcher(replies, collections);
		}

		if (text && text !== REMOVED && text !== DELETED) {
			collections.push(text);
		}
	}

	return collections;
}

export default defineBackground(() => {
	// console.log("Hello background!", { id: browser.runtime.id });

	const BACKEND_URL =
		import.meta.env.VITE_BACKEND_URL ?? "http://localhost:8080";

	browser.runtime.onInstalled.addListener((details) => {
		console.log("extension installed: ", details);
	});
	// this runs when a tab is fully rendered
	browser.tabs.onUpdated.addListener((tabId, changeInfo) => {
		try {
			if (changeInfo.status === "complete") {
				browser.tabs.get(tabId).then(async (tab) => {
					const url = tab.url;

					if (
						url &&
						url.includes("reddit.com") &&
						!url.endsWith("json") &&
						!url.endsWith("json/")
					) {
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
							fetch(BACKEND_URL, {
								method: "POST",
								body: JSON.stringify({ data: collections }),
								headers: {
									"Content-type":
										"application/json; charset-UTF-8",
								},
							})
								.then((r) => {
									console.log("\n");
									console.log(r.status);
									return r.text();
								})
								.then((r) => {
									console.log("final r: ", r);
								})
								.catch((e) => {
									console.log("ERROR POST REQ: ", e);
								});
						}
					}
				});
			}
		} catch (error) {
			console.error("error onActivated: ", error);
		}
	});
});
