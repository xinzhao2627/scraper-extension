import { useState } from "react";
import { defineExtensionMessaging } from "@webext-core/messaging";

import "./App.css";
interface BackgroundProtocolMap {
	scrapeCurrentTab(): Promise<{ success: boolean; error?: string }>;
}

const { sendMessage } = defineExtensionMessaging<BackgroundProtocolMap>();

function App() {
	const [loading, setLoading] = useState(false);
	const [message, setMessage] = useState("");
	const handleScrape = async function () {
		setLoading(true);
		setMessage("");
		try {
			const res = await sendMessage("scrapeCurrentTab", undefined);
			if (res.success) {
				setMessage("Scraping completed");
			} else {
				setMessage("error: " + res.error);
			}
		} catch (error) {
			setMessage(
				`Error: ${
					error instanceof Error ? error.message : String(error)
				}`
			);
		}
		setLoading(false);
	};
	return (
		<div>
			<h1>Reddit scraper</h1>
			<button disabled={loading} onClick={handleScrape}>
				{loading ? "Scraping..." : "Scrape"}
			</button>
			{message && <p>{message}</p>}
		</div>
	);
}

export default App;
