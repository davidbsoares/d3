import { useMemo } from "react";
import { geoNaturalEarth1, geoPath, geoGraticule, scaleSqrt, max } from "d3";

import Svg from "core/ui/Svg";
import Loading from "core/ui/Loading";

import useStore from "../data";
import { WorldType, MapType } from "../models";


const projection = geoNaturalEarth1();
const path = geoPath(projection);
const graticule = geoGraticule();

Map.World = ({ atlas }: WorldType) => {
	if (!atlas) return <Loading />;
	const { land, interiors } = atlas;

	return useMemo(() => (
		<>
			<Svg.Path d={path({ type: "Sphere" }) || ""} fill="#fbfbfb" />
			<Svg.Path d={path(graticule()) || ""} fill="none" stroke="#ececec" strokeWidth={0.5} />
			{land?.features.map((f, i) => {
				const p = path(f);
				return p && <Svg.Path fill="#d8d8d8" stroke="#ececec" d={p} key={i} />;
			})}
			<Svg.Path d={path(interiors) || ""} fill="none" stroke="#d9dfe0" strokeWidth={0.5} />
		</>
	), [path, graticule, land, interiors]);
};

export default function Map({ data }: MapType) {
	const { atlas, axis, raw } = useStore();
	if (!atlas) return <Loading />;

	const sizeScale = useMemo(() => scaleSqrt()
		.domain([0, max(raw, axis.y) as number])
		.range([0, 15]), [raw]);

	return (
		<Svg.G>
			<Map.World atlas={atlas} />
			{data?.map((c, i) => {
				const l = projection(c.coordinates);
				return <Svg.Circle cx={l?.[0]} cy={l?.[1]} r={sizeScale(axis.y(c))} fill="#137b80" opacity={0.3} key={i} />;
			})}
		</Svg.G>
	);
}