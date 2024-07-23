import { format as fd3 } from "d3";

export const format = (v: number | string, fmt = ".2s") => {
	const f = fd3(fmt);

	if (typeof v === "string") return f(parseInt(v)).replace("G", "B");
	return f(v).replace("G", "B");
};