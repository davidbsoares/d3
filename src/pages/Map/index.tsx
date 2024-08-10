import { geoNaturalEarth1, geoPath, geoGraticule } from "d3";

import Svg from "core/ui/Svg";
import Box from "core/ui/Box";
import Loading from "core/ui/Loading";

import useData from "./fabric";


const l = {
	height: 600,
	width: 1000
};

export default function Map() {
	const data = useData();
	if (!data) return <Loading />;

	const projection = geoNaturalEarth1();
	const path = geoPath(projection);
	const graticule = geoGraticule();

	return (
		<Box.Column className="h-dvh">
			<Svg width={l.width} height={l.height}>
				<Svg.G>
					<Svg.Path d={path({ type: "Sphere" }) || ""} fill="#ececec" />
					<Svg.Path d={path(graticule()) || ""} fill="none" stroke="#dadada" strokeWidth={0.5} />
					{data?.land.features.map((f, i) => {
						const p = path(f);
						return p && <Svg.Path fill="#137b80" stroke="#c0c0bb" d={p} key={i} />;
					})}
					<Svg.Path d={path(data.interiors) || ""} fill="none" stroke="#339498" strokeWidth={0.5} />
				</Svg.G>
			</Svg>
		</Box.Column>
	);
}