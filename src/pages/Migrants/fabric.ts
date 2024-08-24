import { useEffect } from "react";
import { csv, json } from "d3";
import { feature, mesh } from "topojson-client";

import { Topology } from "topojson-specification";
import { Migrant, MigrantRaw } from "./models";
import useStore from "./data";


const jsonUrl = "https://unpkg.com/world-atlas@2.0.2/countries-50m.json";
const csvUrl = "https://gist.githubusercontent.com/curran/a9656d711a8ad31d812b8f9963ac441c/raw/c22144062566de911ba32509613c84af2a99e8e2/MissingMigrants-Global-2019-10-08T09-47-14-subset.csv";


export function useAtlas() {
	const { atlas, axis, setAtlas } = useStore();

	useEffect(() => {
		if (!atlas) json<Topology>(jsonUrl).then(t => {
			if (!t) return;
			const { countries, land } = t.objects;

			// @ts-expect-error Problems with topojson types
			setAtlas({ land: feature(t, land), interiors: mesh(t, countries, (a, b) => a !== b) });
		});
	}, []);

	return { atlas, axis };
}

export function useMigrants() {
	const { migrants, axis, setMigrants } = useStore();

	const parse = (d: MigrantRaw): Migrant => ({
		total: +d["Total Dead and Missing"],
		coordinates: d["Location Coordinates"].split(",").map(d => +d).reverse() as [number, number],
		date: new Date(d["Reported Date"])
	});

	useEffect(() => {
		if (!migrants.length) csv(csvUrl, parse).then(setMigrants);
	}, []);

	return { migrants, axis };
}