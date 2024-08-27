import Box from "core/ui/Box";
import Loading from "core/ui/Loading";
import Svg from "core/ui/Svg";

import { useAtlas, useMigrants } from "./fabric";

import Map from "./components/Map";
import Histogram from "./components/Histogram";
import { useState } from "react";


const config = {
	height: 500, width: 960,
	hist: 0.25,
	get histogram() {
		return ({
			position: this.height - this.hist * this.height,
			height: this.hist * this.height
		});
	}
};

export default function Migrants() {
	const atlas = useAtlas();
	const { raw, axis } = useMigrants();
	const [brushExtent, setBrushExtent] = useState<Date[]>([]);

	if (!raw.length || !atlas) return <Loading />;

	const filteredData = brushExtent ? raw.filter(d => {
		const date = axis.x(d);
		return date > brushExtent[0] && date < brushExtent[1];
	}) : raw;

	return (
		<Box.Column>
			<Svg width={config.width} height={config.height}>
				<Map data={filteredData} />
				<Histogram setBrushExtent={setBrushExtent} position={config.histogram.position} height={config.histogram.height} width={config.width} />
			</Svg>
		</Box.Column>
	);
}