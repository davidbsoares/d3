import { useEffect, useState } from "react";
import { csv, max, min, scaleLinear } from "d3";

import { format } from "core/numbers";

import Svg from "core/ui/Svg";
import Box from "core/ui/Box";

import { Item, Raw, Row, X, Y } from "./Types";
import Loading from "core/ui/Loading";


const l = {
	url: "https://gist.githubusercontent.com/curran/a08a1080b88344b0c8a7/raw/0e7a9b0a5d22642a06d3d5b9bcbad9890c8ee534/iris.csv",
	height: 600,
	width: 800,
	margin: { top: 20, right: 30, bottom: 65, left: 90 },
	x: (d: Row) => d.petal_length,
	y: (d: Row) => d.sepal_width,
	label: {
		x: 40,
		y: -50
	}
};

const inner = {
	height: l.height - l.margin.top - l.margin.bottom,
	width: l.width - l.margin.left - l.margin.right
};

const useData = () => {
	const [data, setData] = useState<Row[]>();

	useEffect(() => {
		const row = (d: Raw): Row => {
			const body = {
				sepal_length: +d.sepal_length,
				sepal_width: +d.sepal_width,
				petal_length: +d.petal_length,
				petal_width: +d.petal_width,
				species: `${d.species}`
			};
			return body;
		};
		if (!data) csv(l.url, row).then(setData);
	}, []);

	return data;
};

Scatter.X = ({ x, fmt }: X) =>	{
	return x.ticks().map(t => (
		<Svg.G transform={`translate(${x(t)},0)`} key={t}>
			<Svg.Line y2={inner.height} className="stroke-gray-300" />
			<Svg.Text dy="0.71em" y={inner.height + 5} className="font-serif" textAnchor="middle">{format(t, fmt)}</Svg.Text>
		</Svg.G>
	));
};

Scatter.Y = ({ y }: Y) => y.ticks().map(t => (
	<Svg.G transform={`translate(0,${y(t)})`}>
		<Svg.Line x2={inner.width} className="stroke-gray-300" />
		<Svg.Text x={-5} dy="0.32em" className="font-serif fill-gray-500" textAnchor="end" key={t}>{t}</Svg.Text>
	</Svg.G>
));

Scatter.Item = ({ x, y, d }: Item) => {
	const a = l.x(d);
	const b = l.y(d);

	return (
		<Svg.Circle cx={x(a)} cy={y(b)} r={5} className="fill-teal-500">
			<Svg.Title>{format(a)}</Svg.Title>
		</Svg.Circle>
	);
};

export default function Scatter() {
	const data = useData();

	if (!data) return <Loading />;

	const x = scaleLinear()
		.domain([
			min(data, l.x) as number,
			max(data, l.x) as number
		])
		.range([0, inner.width])
		.nice();
	const y = scaleLinear()
		.domain([
			min(data, l.y) as number,
			max(data, l.y) as number
		])
		.range([0, inner.height])
		.nice();

	return (
		<Box.Column className="h-dvh">
			<Svg width={l.width} height={l.height}>
				<Svg.G transform={`translate(${l.margin.left},${l.margin.right})`}>
					<Scatter.X x={x} />
					<Svg.Text textAnchor="middle" className="text-2xl fill-gray-500" transform={`translate(${l.label.y},${inner.height / 2}) rotate(-90)`}>
						Petal Length
					</Svg.Text>
					<Scatter.Y y={y} />
					{data.map(d => <Scatter.Item x={x} y={y} d={d} key={d.species} />)}
					<Svg.Text x={inner.width / 2} y={inner.height + l.label.x} textAnchor="middle" className="text-2xl fill-gray-500">
						Petal Length
					</Svg.Text>
				</Svg.G>
			</Svg>
		</Box.Column>
	);
}