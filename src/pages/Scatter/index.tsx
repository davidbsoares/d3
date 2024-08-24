import { useState } from "react";
import { max, min, scaleLinear, scaleOrdinal } from "d3";

import { format } from "core/numbers";

import Svg from "core/ui/Svg";
import Box from "core/ui/Box";
import Loading from "core/ui/Loading";
import Select from "core/ui/Select";
import Text from "core/ui/Text";

import useData from "./fabric";
import { Row, X, Y, S, FilterType, Values, Marks, LegendType } from "./Types";


const l = {
	height: 600,
	width: 800,
	margin: { top: 20, right: 30, bottom: 65, left: 90 },
	x: (d: Row, v: Values) => d[v],
	y: (d: Row, v: Values) => d[v],
	color: (d: Row) => d.species,
	options: [
		{ value: "petal_length", label: "Petal Length" },
		{ value: "petal_width", label: "Petal Width" },
		{ value: "sepal_length", label: "Sepal Length" },
		{ value: "sepal_width", label: "Sepal Width" }
	],
	colors: ["#e6842a", "#137b80", "#8e6c8a"],
	label: {
		x: 40,
		y: -50
	}
};

const inner = {
	height: l.height - l.margin.top - l.margin.bottom,
	width: l.width - l.margin.left - l.margin.right
};

const Filter = ({ setFilter, filter }: S) => {
	const change = (v: string, filter: "x" | "y") => setFilter(s => ({ ...s, [filter]: v }));

	return (
		<Box className="items-center gap-1">
			<Text.H3>{filter.toUpperCase()}</Text.H3>
			<Select options={l.options} onChange={v => change(v.value, filter)} />
		</Box>
	);
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

Scatter.Marks = ({ data, scale, filter }: Marks) => data.map((d, k) => {
	const a = l.x(d, filter.x);
	const b = l.y(d, filter.y);

	return (
		<Svg.Circle cx={scale.x(a)} cy={scale.y(b)} r={5} fill={scale.color(l.color(d))} key={k}>
			<Svg.Title>{format(a)}</Svg.Title>
		</Svg.Circle>
	);
});

Scatter.Legend = ({ color, spacing = 20, size = 7, offset = 20, focused, onFocus: onHover }: LegendType) => color.domain().map((v, i) => (
	<Svg.G transform={`translate(0,${i * spacing})`} opacity={focused && v !== focused ? 0.2 : 1} onMouseEnter={() => onHover(v)} onMouseLeave={() => onHover("")} key={i}>
		<Svg.Circle fill={color(v)} r={size} />
		<Svg.Text x={offset} dy=".32em" className="cursor-default">{v}</Svg.Text>
	</Svg.G>
));

export default function Scatter() {
	const data = useData();
	const [filter, setFilter] = useState<FilterType>({ x: "petal_length", y: "sepal_width" });
	const [focused, setFocused] = useState("");

	if (!data) return <Loading />;
	const filtered = data.filter(d => focused === l.color(d));

	const scale = {
		x: scaleLinear()
			.domain([
				min(data, (d) => l.x(d, filter.x)) as number,
				max(data, (d) => l.x(d, filter.x)) as number
			])
			.range([0, inner.width])
			.nice(),
		y: scaleLinear()
			.domain([
				min(data, (d) => l.y(d, filter.y)) as number,
				max(data, (d) => l.y(d, filter.y)) as number
			])
			.range([0, inner.height])
			.nice(),
		color: scaleOrdinal<string>()
			.domain(data.map(l.color))
			.range(l.colors)
	};

	return (
		<Box.Column>
			<Box className="justify-center gap-8">
				<Filter filter="x" setFilter={setFilter} />
				<Filter filter="y" setFilter={setFilter} />
			</Box>
			<Svg width={l.width} height={l.height} className="overflow-visible">
				<Svg.G transform={`translate(${l.margin.left},${l.margin.right})`}>
					<Scatter.X x={scale.x} />
					<Svg.Text textAnchor="middle" className="text-2xl fill-gray-500" transform={`translate(${l.label.y},${inner.height / 2}) rotate(-90)`}>
						Petal Length
					</Svg.Text>
					<Scatter.Y y={scale.y} />
					<Svg.G transform={`translate(${inner.width + 60},60)`}>
						<Svg.Text x={35} y={-25} textAnchor="middle" className="text-2xl fill-gray-500">
							Species
						</Svg.Text>
						<Scatter.Legend color={scale.color} focused={focused} onFocus={setFocused} />
					</Svg.G>
					<Svg.G opacity={focused ? 0.2 : 1}>
						<Scatter.Marks data={data} scale={scale} filter={filter} />
					</Svg.G>
					<Scatter.Marks data={filtered} scale={scale} filter={filter} />
					<Svg.Text x={inner.width / 2} y={inner.height + l.label.x} textAnchor="middle" className="text-2xl fill-gray-500">
						Petal Length
					</Svg.Text>
				</Svg.G>
			</Svg>
		</Box.Column>
	);
}