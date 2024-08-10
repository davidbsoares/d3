import { useEffect, useState } from "react";
import { json } from "d3";
import { feature, mesh } from "topojson-client";

import { Topology } from "topojson-specification";
import { Data } from "./Types";


const url = "https://unpkg.com/world-atlas@2.0.2/countries-50m.json";

export default function useData() {
	const [data, setData] = useState<Data>();

	useEffect(() => {
		if (!data) json<Topology>(url).then(t => {
			if (!t) return;
			const { countries, land } = t.objects;

			// @ts-expect-error Problems with topojson types
			setData({ land: feature(t, land), interiors: mesh(t, countries, (a, b) => a !== b) });
		});
	}, []);

	return data;
}