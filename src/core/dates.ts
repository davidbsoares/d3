import { timeFormat as fd3 } from "d3";

export const format = (v: Date, fmt = "%a") => {
	const f = fd3(fmt);

	if (typeof v === "string") return f(v).replace("G", "B");
	return f(v).replace("G", "B");
};

export default { format };