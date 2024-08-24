import { useEffect, useState } from "react";
import { csv, json } from "d3";
import { feature, mesh } from "topojson-client";

import { Topology } from "topojson-specification";
import { Atlas, City, CityRaw } from "./models";


const jsonUrl = "https://unpkg.com/world-atlas@2.0.2/countries-50m.json";
const csvUrl = "https://gist.githubusercontent.com/curran/13d30e855d48cdd6f22acdf0afe27286/raw/0635f14817ec634833bb904a47594cc2f5f9dbf8/worldcities_clean.csv";


export function useAtlas() {
	const [data, setData] = useState<Atlas>();

	useEffect(() => {
		if (!data) json<Topology>(jsonUrl).then(t => {
			if (!t) return;
			const { countries, land } = t.objects;

			// @ts-expect-error Problems with topojson types
			setData({ land: feature(t, land), interiors: mesh(t, countries, (a, b) => a !== b) });
		});
	}, []);

	return data;
}

export function useCities() {
	const [data, setData] = useState<City[]>();

	const parse = (d: CityRaw) => ({ ...d, lat: +d.lat, lng: +d.lng, population: +d.population });
	useEffect(() => {
		if (!data) csv(csvUrl, parse).then(setData);
	}, []);
	return data;
}