import { useEffect, useState } from "react";
import { csv, max, scaleBand, scaleLinear } from "d3";

import { format } from "core/numbers";

import Svg from "core/ui/Svg";
import Box from "core/ui/Box";

import { Item, Row, X, Y } from "./models";
import Loading from "core/ui/Loading";


const l = {
	url: "https://gist.githubusercontent.com/curran/0ac4077c7fc6390f5dd33bf5c06cb5ff/raw/605c54080c7a93a417a3cea93fd52e7550e76500/UN_Population_2019.csv",
	height: 600,
	width: 800,
	margin: { top: 20, right: 30, bottom: 70, left: 220 },
	x: (d: Row) => d.Country,
	y: (d: Row) => parseInt(d.Population)
};

const inner = {
	height: l.height - l.margin.top - l.margin.bottom,
	width: l.width - l.margin.left - l.margin.right
};

const useData = () => {
	const [data, setData] = useState<Row[]>();

	useEffect(() => {
		const row = (d: Row) => {
			d.Population = `${parseInt(d["2020"]) * 1000}`;
			return d;
		};
		if (!data) csv(l.url, row).then(d => setData(d.slice(0, 10)));
	}, []);

	return data;
};

Bar.X = ({ x, fmt }: X) => {
	return x.ticks().map(t => (
		<Svg.G transform={`translate(${x(t)},0)`} key={t}>
			<Svg.Line y2={inner.height} className="stroke-gray-300" />
			<Svg.Text dy="0.71em" y={inner.height + 3} className="font-serif" textAnchor="middle">{format(t, fmt)}</Svg.Text>
		</Svg.G>
	));
};

Bar.Y = ({ y }: Y) => y.domain().map(t => <Svg.Text x={-3} y={(y(t) || 0) + y.bandwidth() / 2} dy="0.32em" className="font-serif fill-gray-500" textAnchor="end" key={t}>{t}</Svg.Text>);

Bar.Item = ({ x, y, d }: Item) => (
	<Svg.Rect x={0} y={y(d.Country)} width={x(parseInt(d.Population))} height={y.bandwidth()} className="fill-teal-500">
		<Svg.Title>{format(parseInt(d.Population))}</Svg.Title>
	</Svg.Rect>
);

export default function Bar() {
	const data = useData();

	if (!data) return <Loading />;

	const y = scaleBand().domain(data.map(l.x)).range([0, inner.height]).paddingInner(0.2);
	const x = scaleLinear().domain([0, max(data, l.y) || 100]).range([0, inner.width]);

	return (
		<Box.Column>
			<Svg width={l.width} height={l.height}>
				<Svg.G transform={`translate(${l.margin.left},${l.margin.right})`}>
					<Bar.X x={x} />
					<Bar.Y y={y} />
					<Svg.Text x={inner.width / 2} y={inner.height + 40} textAnchor="middle" className="text-2xl fill-gray-500" >Population</Svg.Text>
					{data.map(d => <Bar.Item x={x} y={y} d={d} key={d.Country} />)}
				</Svg.G>
			</Svg>
		</Box.Column>
	);
}