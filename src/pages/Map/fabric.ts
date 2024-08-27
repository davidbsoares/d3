import { useEffect } from "react";
import { csv, json } from "d3";
import { feature, mesh } from "topojson-client";
import { Topology } from "topojson-specification";

import { CityRaw } from "./models";
import useStore from "./data";


const jsonUrl = "https://unpkg.com/world-atlas@2.0.2/countries-50m.json";
const csvUrl = "https://gist.githubusercontent.com/curran/13d30e855d48cdd6f22acdf0afe27286/raw/0635f14817ec634833bb904a47594cc2f5f9dbf8/worldcities_clean.csv";


export function useAtlas() {
	const { atlas, setAtlas } = useStore();

	useEffect(() => {
		if (!atlas) json<Topology>(jsonUrl).then(t => {
			if (!t) return;
			const { countries, land } = t.objects;

			// @ts-expect-error Problems with topojson types
			setAtlas({ land: feature(t, land), interiors: mesh(t, countries, (a, b) => a !== b) });
		});
	}, []);

	return atlas;
}

export function useCities() {
	const { cities, setCities } = useStore();

	const parse = (d: CityRaw) => ({ ...d, lat: +d.lat, lng: +d.lng, population: +d.population });
	useEffect(() => {
		if (!cities.length) csv(csvUrl, parse).then(setCities);
	}, []);

	return cities;
}