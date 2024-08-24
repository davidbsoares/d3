import { geoNaturalEarth1, geoPath, geoGraticule, scaleSqrt, max } from "d3";


import Svg from "core/ui/Svg";
import Box from "core/ui/Box";
import Loading from "core/ui/Loading";

import { useAtlas, useMigrants } from "../fabric";


const l = {
	height: 600, width: 1000,
	margin: { top: 20, right: 30, bottom: 65, left: 90 },
	label: { x: 40, y: -50 }
};

export default function Map() {
	const { atlas, axis } = useAtlas();
	const { migrants } = useMigrants();

	if (!atlas) return <Loading />;

	const projection = geoNaturalEarth1();
	const path = geoPath(projection);
	const graticule = geoGraticule();

	const sizeScale = scaleSqrt()
		.domain([0, max(migrants, axis.y) as number])
		.range([0, 15]);

	return (
		<Box.Column >
			<Svg width={l.width} height={l.height}>
				<Svg.G>
					<Svg.Path d={path({ type: "Sphere" }) || ""} fill="#fbfbfb" />
					<Svg.Path d={path(graticule()) || ""} fill="none" stroke="#ececec" strokeWidth={0.5} />
					{atlas?.land.features.map((f, i) => {
						const p = path(f);
						return p && <Svg.Path fill="#d8d8d8" stroke="#ececec" d={p} key={i} />;
					})}
					<Svg.Path d={path(atlas.interiors) || ""} fill="none" stroke="#d9dfe0" strokeWidth={0.5} />
					{migrants.map((c, i) => {
						const l = projection(c.coordinates);
						return <Svg.Circle cx={l?.[0]} cy={l?.[1]} r={sizeScale(axis.y(c))} fill="#137b80" opacity={0.3} key={i} />;
					})}
				</Svg.G>
			</Svg>
		</Box.Column>
	);
}