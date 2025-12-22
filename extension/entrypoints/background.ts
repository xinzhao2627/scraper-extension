import jsonQuery from "json-query";
import { defineExtensionMessaging } from "@webext-core/messaging";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL ?? "http://localhost:8080";
const REMOVED = "[removed]";
const DELETED = "[deleted]";
interface BackgroundProtocolMap {
	scrapeCurrentTab(): Promise<{ success: boolean; error?: string }>;
}

export const { sendMessage: sendToBackground, onMessage: onBackgroundMessage } =
	defineExtensionMessaging<BackgroundProtocolMap>();

export default defineBackground(() => {
	// run getData(url) when called from popup
	onBackgroundMessage("scrapeCurrentTab", async () => {
		console.log("hihi");

		const [tab] = await browser.tabs.query({
			active: true,
			currentWindow: true,
		});

		if (tab.url) {
			// await getData(tab.url);
			return { success: true };
		}

		return { success: false, error: "No active tab URL found" };
	});
});

async function getData(url: string) {
	if (
		url &&
		url.includes("reddit.com") &&
		!url.endsWith("json") &&
		!url.endsWith("json/")
	) {
		const url_json = url.endsWith("/") ? url + ".json" : url + "/.json";

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
					"Content-type": "application/json; charset-UTF-8",
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
}

function recursive_replies_fetcher(replies: any, collections: string[]) {
	if (!replies) {
		return;
	}

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
