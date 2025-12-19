import jsonQuery from "json-query";

export function getBody(data: unknown): string[] {
	const result = jsonQuery("**.body", { data }).value;

	if (!Array.isArray(result)) {
		return [];
	}

	return result.filter((v): v is string => typeof v === "string");
}
