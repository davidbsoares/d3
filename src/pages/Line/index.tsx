import { useEffect, useState } from "react";
import { csv, curveNatural, extent, line, scaleLinear, scaleTime } from "d3";

import dates from "core/dates";

import Svg from "core/ui/Svg";
import Box from "core/ui/Box";
import Loading from "core/ui/Loading";

import { Marks, Raw, Row, X, Y } from "./models";


const l = {
	url: "https://gist.githubusercontent.com/curran/90240a6d88bdb1411467b21ea0769029/raw/7d4c3914cc6a29a7f5165f7d5d82b735d97bcfe4/week_temperature_sf.csv",
	height: 600,
	width: 900,
	margin: { top: 20, right: 30, bottom: 65, left: 90 },
	x: (d: Row) => d.timestamp,
	y: (d: Row) => d.temperature,
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
				temperature: +d.temperature,
				timestamp: new Date(d.timestamp)
			};
			return body;
		};
		if (!data) csv(l.url, row).then(setData);
	}, []);

	return data;
};

Line.X = ({ x, fmt }: X) => {
	return x.ticks().map((t, i) => (
		<Svg.G transform={`translate(${x(t)},0)`} key={i}>
			<Svg.Line y2={inner.height} className="stroke-gray-300" />
			<Svg.Text dy="0.71em" y={inner.height + 5} className="font-serif" textAnchor="middle">{dates.format(t, fmt)}</Svg.Text>
		</Svg.G>
	));
};

Line.Y = ({ y }: Y) => y.ticks().map((t, i) => (
	<Svg.G transform={`translate(0,${y(t)})`} key={i}>
		<Svg.Line x2={inner.width} className="stroke-gray-300" />
		<Svg.Text x={-5} dy="0.32em" className="font-serif fill-gray-500" textAnchor="end">{t}</Svg.Text>
	</Svg.G>
));

Line.Marks = ({ x, y, data }: Marks) => {
	const d = line<Row>().x(d => x(l.x(d))).y(d => y(l.y(d))).curve(curveNatural)(data) || undefined;
	return (
		<Svg.Path
			fill="none"
			stroke="black"
			strokeWidth={4}
			strokeLinejoin="round"
			strokeLinecap="round"
			d={d}
		/>
	);
};

export default function Line() {
	const data = useData();

	if (!data) return <Loading />;

	const x = scaleTime()
		.domain(extent(data, l.x) as [Date, Date])
		.range([0, inner.width])
		.nice();

	const y = scaleLinear()
		.domain(extent(data, l.y) as [number, number])
		.range([inner.height, 0])
		.nice();


	return (
		<Box.Column>
			<Svg width={l.width} height={l.height}>
				<Svg.G transform={`translate(${l.margin.left},${l.margin.top})`}>
					<Line.X x={x} />
					<Svg.Text textAnchor="middle" className="text-2xl fill-gray-500" transform={`translate(${l.label.y},${inner.height / 2}) rotate(-90)`}>
						Temperature
					</Svg.Text>
					<Line.Y y={y} />

					<Line.Marks data={data} x={x} y={y} />
					<Svg.Text x={inner.width / 2} y={inner.height + l.label.x} textAnchor="middle" className="text-2xl fill-gray-500">
						Time
					</Svg.Text>
				</Svg.G>
			</Svg>
		</Box.Column>
	);
}