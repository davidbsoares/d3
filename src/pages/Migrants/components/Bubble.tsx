import { scaleTime, scaleLinear, extent, timeMonths, bin, sum } from "d3";

import dates from "core/dates";

import Svg from "core/ui/Svg";
import Box from "core/ui/Box";

import { Bin, MarksType, XType, YType } from "../models";
import { useMigrants } from "../fabric";


const config = {
	height: 600, width: 1000,
	margin: { top: 20, right: 30, bottom: 65, left: 90 },
	label: { x: 40, y: -50 },
	get inner() {
		return ({
			height: this.height - this.margin.top - this.margin.bottom,
			width: this.width - this.margin.left - this.margin.right
		});
	}
};

const X = ({ x }: XType) => {
	return x.ticks().map((t, i) => (
		<Svg.G transform={`translate(${x(t)},0)`} key={i}>
			<Svg.Line y2={config.inner.height} className="stroke-gray-300" />
			<Svg.Text dy="0.71em" y={config.inner.height + 5} className="font-serif" textAnchor="middle">{dates.format(t, "%Y")}</Svg.Text>
		</Svg.G>
	));
};

const Y = ({ y }: YType) => y.ticks().map((t, i) => (
	<Svg.G transform={`translate(0,${y(t)})`} key={i}>
		<Svg.Line x2={config.inner.width} className="stroke-gray-300" />
		<Svg.Text x={-5} dy="0.32em" className="font-serif fill-gray-500" textAnchor="end">{t}</Svg.Text>
	</Svg.G>
));

const Marks = ({ x, y, binned }: MarksType) => binned.map((b, i) => (
	<Svg.Rect
		fill="#137B80"
		x={x(b.x0)}
		y={y(b.y)}
		width={x(b.x1) - x(b.x0)}
		height={config.inner.height - y(b.y)}
		key={i}
	/>
));

export default function Histogram() {
	const { migrants, axis } = useMigrants();
	const x = scaleTime()
		.domain(extent(migrants, axis.x) as [Date, Date])
		.range([0, config.inner.width])
		.nice();

	const y = scaleLinear()
		.domain(extent(migrants, axis.y) as [number, number])
		.range([config.inner.height, 0])
		.nice();


	const [start, stop] = x.domain();
	const t = timeMonths(start, stop).map(d => d.getTime());

	const binned = bin()
		// @ts-expect-error: strange type limitation in bin. Investigate
		.value(axis.x)
		.domain([start.getTime(), stop.getTime()])
		// @ts-expect-error: strange type limitation in bin. Investigate
		.thresholds(t)(migrants)
		.map<Bin>(array => ({
			// @ts-expect-error: strange type limitation in bin. Investigate
			y: sum(array, axis.y),
			x0: array.x0 as number,
			x1: array.x1 as number
		}));

	return (
		<Box.Column>
			<Svg width={config.width} height={config.height}>
				<Svg.G transform={`translate(${config.margin.left},${config.margin.top})`}>
					<X x={x} />
					<Svg.Text textAnchor="middle" className="text-2xl fill-gray-500" transform={`translate(${config.label.y},${config.inner.height / 2}) rotate(-90)`}>
						Dead and Missing
					</Svg.Text>
					<Y y={y} />
					<Marks x={x} y={y} binned={binned} />
					<Svg.Text x={config.inner.width / 2} y={config.inner.height + config.label.x} textAnchor="middle" className="text-2xl fill-gray-500">
						Time
					</Svg.Text>
				</Svg.G>
			</Svg>
		</Box.Column>
	);
}