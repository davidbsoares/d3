import { geoNaturalEarth1, geoPath, geoGraticule, scaleSqrt, max } from "d3";

import Svg from "core/ui/Svg";
import Box from "core/ui/Box";
import Loading from "core/ui/Loading";

import { useAtlas, useCities } from "./fabric";
import { City } from "./Types";


const l = {
	height: 600,
	width: 1000
};

export default function Map() {
	const atlas = useAtlas();
	const cities = useCities();

	if (!atlas || !cities) return <Loading />;

	const projection = geoNaturalEarth1();
	const path = geoPath(projection);
	const graticule = geoGraticule();

	const sizeValue = (c: City) => c.population;
	const sizeScale = scaleSqrt()
		.domain([0, max(cities, sizeValue) as number])
		.range([0, 15]);

	return (
		<Box.Column>
			<Svg width={l.width} height={l.height}>
				<Svg.G>
					<Svg.Path d={path({ type: "Sphere" }) || ""} fill="#fbfbfb" />
					<Svg.Path d={path(graticule()) || ""} fill="none" stroke="#ececec" strokeWidth={0.5} />
					{atlas?.land.features.map((f, i) => {
						const p = path(f);
						return p && <Svg.Path fill="#d8d8d8" stroke="#ececec" d={p} key={i} />;
					})}
					<Svg.Path d={path(atlas.interiors) || ""} fill="none" stroke="#d9dfe0" strokeWidth={0.5} />
					{cities.map((c, i) => {
						const l = projection([c.lng, c.lat]);
						return <Svg.Circle cx={l?.[0]} cy={l?.[1]} r={sizeScale(sizeValue(c))} fill="#137b80" opacity={0.3} key={i} />;
					})}
				</Svg.G>
			</Svg>
		</Box.Column>
	);
}