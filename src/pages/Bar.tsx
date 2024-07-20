import { useEffect, useState } from "react";
import { csv, max, scaleBand, scaleLinear } from "d3";

import Svg from "core/ui/Svg";
import Box from "core/ui/Box";


const url = "https://gist.githubusercontent.com/curran/0ac4077c7fc6390f5dd33bf5c06cb5ff/raw/605c54080c7a93a417a3cea93fd52e7550e76500/UN_Population_2019.csv";


Bar.Loading = () => <h1>Loading...</h1>;

type Row = {
	[key:string]: string;
}

export default function Bar() {
	const [data, setData] = useState<Row[]>();

	const row = (d:Row) => {
		d.Population = d["2020"];
		return d;
	};
	useEffect(() => {
		if (!data) csv(url, row).then(d => setData(d.slice(0, 10)));
	}, []);

	if (!data) return <Bar.Loading />;

	const y = scaleBand().domain(data.map(d => d.Country)).range([0, 800]);

	const x = scaleLinear().domain([0, max(data, (d) => parseInt(d.Population)) || 100]).range([0, 500]);

	return (
		<Box.Column className="h-dvh">
			<Svg className="h-[400px]">
				{data.map(d => {
					// console.log(x(parseInt(d.Population)));
					return <Svg.Rect x={0} y={y(d.Country)} width={x(parseInt(d.Population))} height={y.bandwidth()} key={d.Country} />;
				} )}
			</Svg>
		</Box.Column>
	);
}