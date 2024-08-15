import { useEffect, useState } from "react";
import { csv, max, min, scaleLinear } from "d3";

import { format } from "core/numbers";

import Svg from "core/ui/Svg";
import Box from "core/ui/Box";
import Loading from "core/ui/Loading";

import { Item, Raw, Row, X, Y, S, Filter, Values } from "./Types";
import Select from "core/ui/Select";
import Text from "core/ui/Text";


const l = {
	url: "https://gist.githubusercontent.com/curran/a08a1080b88344b0c8a7/raw/0e7a9b0a5d22642a06d3d5b9bcbad9890c8ee534/iris.csv",
	height: 600,
	width: 800,
	margin: { top: 20, right: 30, bottom: 65, left: 90 },
	x: (d: Row, v: Values) => d[v],
	y: (d: Row, v: Values) => d[v],
	options: [
		{ value: "petal_length", label: "Petal Length" },
		{ value: "petal_width", label: "Petal Width" },
		{ value: "sepal_length", label: "Sepal Length" },
		{ value: "sepal_width", label: "Sepal Width" }
	],
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

Scatter.X = ({ x, fmt }: X) => {
	return x.ticks().map(t => (
		<Svg.G transform={`translate(${x(t)},0)`} key={t}>
			<Svg.Line y2={inner.height} className="stroke-gray-300" />
			<Svg.Text dy="0.71em" y={inner.height + 5} className="font-serif" textAnchor="middle">{format(t, fmt)}</Svg.Text>
		</Svg.G>
	));
};

Scatter.Y = ({ y }: Y) => y.ticks().map((t, i) => (
	<Svg.G transform={`translate(0,${y(t)})`} key={i}>
		<Svg.Line x2={inner.width} className="stroke-gray-300" />
		<Svg.Text x={-5} dy="0.32em" className="font-serif fill-gray-500" textAnchor="end">{t}</Svg.Text>
	</Svg.G>
));

Scatter.Item = ({ x, y, d, filter }: Item) => {
	const a = l.x(d, filter.x);
	const b = l.y(d, filter.y);

	return (
		<Svg.Circle cx={x(a)} cy={y(b)} r={5} className="fill-teal-500">
			<Svg.Title>{format(a)}</Svg.Title>
		</Svg.Circle>
	);
};


const _Select = ({ setFilter, filter }: S) => {
	const change = (v: string, filter: "x" | "y") => setFilter(s => ({ ...s, [filter]: v }));

	return (
		<Box className="items-center gap-1">
			<Text.H3>{filter.toUpperCase()}</Text.H3>
			<Select options={l.options} onChange={v => change(v.value, filter)} />
		</Box>
	);
};

export default function Scatter() {
	const data = useData();
	const [filter, setFilter] = useState<Filter>({ x: "petal_length", y: "sepal_width" });

	if (!data) return <Loading />;

	const x = scaleLinear()
		.domain([
			min(data, (d) => l.x(d, filter.x)) as number,
			max(data, (d) => l.x(d, filter.x)) as number
		])
		.range([0, inner.width])
		.nice();

	const y = scaleLinear()
		.domain([
			min(data, (d) => l.y(d, filter.y)) as number,
			max(data, (d) => l.y(d, filter.y)) as number
		])
		.range([0, inner.height])
		.nice();


	return (
		<Box.Column className="h-dvh">
			<Box className="justify-center gap-8">
				<_Select filter="x" setFilter={setFilter} />
				<_Select filter="y" setFilter={setFilter} />
			</Box>
			<Svg width={l.width} height={l.height}>
				<Svg.G transform={`translate(${l.margin.left},${l.margin.right})`}>
					<Scatter.X x={x} />
					<Svg.Text textAnchor="middle" className="text-2xl fill-gray-500" transform={`translate(${l.label.y},${inner.height / 2}) rotate(-90)`}>
						Petal Length
					</Svg.Text>
					<Scatter.Y y={y} />
					{data.map((d, i) => <Scatter.Item x={x} y={y} d={d} filter={filter} key={i} />)}
					<Svg.Text x={inner.width / 2} y={inner.height + l.label.x} textAnchor="middle" className="text-2xl fill-gray-500">
						Petal Length
					</Svg.Text>
				</Svg.G>
			</Svg>
		</Box.Column>
	);
}