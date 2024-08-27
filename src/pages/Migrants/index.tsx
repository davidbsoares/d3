import Box from "core/ui/Box";
import Loading from "core/ui/Loading";
import Svg from "core/ui/Svg";

import { useAtlas, useMigrants } from "./fabric";

import Map from "./components/Map";
import Histogram from "./components/Histogram";


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
	const { atlas } = useAtlas();
	const { migrants } = useMigrants();

	if (!migrants.length || !atlas) return <Loading />;
	return (
		<Box.Column>
			<Svg width={config.width} height={config.height}>
				<Map />
				<Histogram position={config.histogram.position} height={config.histogram.height} width={config.width} />
			</Svg>
		</Box.Column>
	);
}