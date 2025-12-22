import { defineExtensionMessaging } from "@webext-core/messaging";

export interface ProtocolMap {
	retrieveHtml(): Feedback;
}
export interface Feedback {
	status: number;
	data: string;
	error: string;
}

// export const { sendMessage, onMessage } =
// 	defineExtensionMessaging<ProtocolMap>();

export default defineContentScript({
	matches: ["http://*/*", "https://*/*"],
	main() {
		console.log("Hello content.");

		// sample only
		// onMessage("retrieveHtml", (message) => {
		// 	try {
		// 		return {
		// 			status: 200,
		// 			data: "",
		// 			error: "",
		// 		};
		// 	} catch (error) {
		// 		return {
		// 			status: 400,
		// 			data: "",
		// 			error: errorify(error),
		// 		};
		// 	}
		// });
	},
});

function errorify(e: unknown): string {
	return e instanceof Error ? e.message : (e as string);
}
