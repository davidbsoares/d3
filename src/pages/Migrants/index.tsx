import Box from "core/ui/Box";
import Loading from "core/ui/Loading";

import { useAtlas, useMigrants } from "./fabric";

import Map from "./components/Map";
import Histogram from "./components/Bubble";


export default function Migrants() {
	const { atlas } = useAtlas();
	const { migrants } = useMigrants();

	if (!migrants.length || !atlas) return <Loading />;
	return (
		<Box.Column>
			<Map />
			<Histogram />
		</Box.Column>
	);
}