import { useEffect, useMemo, useRef } from "react";
import { scaleTime, scaleLinear, extent, timeMonths, bin, sum, max, brushX, select } from "d3";

import dates from "core/dates";
import Svg from "core/ui/Svg";

import { Bin, HistogramType, MarksType, XType, YType } from "../models";
import useStore from "../data";


const X = ({ x, height }: XType) => {
	return x.ticks().map((t, i) => (
		<Svg.G transform={`translate(${x(t)},0)`} key={i}>
			<Svg.Line y2={height} stroke="#ececec" />
			<Svg.Text dy="0.71em" y={height + 5} className="font-serif text-[0.5em] " textAnchor="middle">{dates.format(t, "%Y")}</Svg.Text>
		</Svg.G>
	));
};

const Y = ({ y, width }: YType) => y.ticks().map((t, i) => (
	<Svg.G transform={`translate(0,${y(t)})`} key={i}>
		<Svg.Line x2={width} stroke="#ececec" />
		<Svg.Text x={-5} dy="0.32em" className="font-serif text-[0.2em] fill-gray-500" textAnchor="end">{t}</Svg.Text>
	</Svg.G>
));

const Marks = ({ x, y, height, binned }: MarksType) => binned.map((b, i) => (
	<Svg.Rect
		fill="#137B80"
		x={x(b.x0)}
		y={y(b.y)}
		width={x(b.x1) - x(b.x0)}
		height={height - y(b.y)}
		key={i}
	/>
));

export default function Histogram({ height, width, position, setBrushExtent }: HistogramType) {
	const { raw, axis } = useStore();
	const ref = useRef<SVGGElement>(null);

	const config = {
		margin: { top: 0, right: 30, bottom: 25, left: 60 },
		label: { x: 25, y: -20 },
		get inner() {
			return ({
				height: height - this.margin.top - this.margin.bottom,
				width: width - this.margin.left - this.margin.right
			});
		}
	};

	const x = useMemo(() => scaleTime()
		.domain(extent(raw, axis.x) as [Date, Date])
		.range([0, config.inner.width])
		.nice(), [raw]);

	const binned = useMemo(() => {
		const [start, stop] = x.domain();
		const t = timeMonths(start, stop).map(d => d.getTime());
		return bin()
			// @ts-expect-error: strange type limitation in bin. Investigate
			.value(axis.x)
			.domain([start.getTime(), stop.getTime()])
			// @ts-expect-error: strange type limitation in bin. Investigate
			.thresholds(t)(raw)
			.map<Bin>(array => ({
				// @ts-expect-error: strange type limitation in bin. Investigate
				y: sum(array, axis.y),
				x0: array.x0 as number,
				x1: array.x1 as number
			}));
	}, [raw, x]);

	const y = useMemo(() => scaleLinear()
		.domain([0, max(binned, (d) => d.y)] as [number, number])
		.range([config.inner.height, 0]), [binned]);

	useEffect(() => {
		if (ref.current) {
			const brush = brushX().extent([[0, 0], [config.inner.width, config.inner.height]]);

			brush(select(ref.current));
			brush.on("brush end", (e) => setBrushExtent(e.selection ? e.selection.map(x.invert) : []));
		}
	}, [ref]);

	return (
		<Svg.G transform={`translate(0, ${position})`}>
			<Svg.Rect width={width} height={height} fill='white' />
			<Svg.G transform={`translate(${config.margin.left}, ${config.margin.top})`}>
				<X x={x} height={config.inner.height} />
				<Svg.Text textAnchor="middle" className="text-[0.6em] fill-gray-500" transform={`translate(${config.label.y},${config.inner.height / 2}) rotate(-90)`}>
					Dead and Missing
				</Svg.Text>
				<Y y={y} width={config.inner.width} />
				<Marks x={x} y={y} binned={binned} height={config.inner.height} />
				<Svg.Text x={config.inner.width / 2} y={config.inner.height + config.label.x} textAnchor="middle" className="text-[0.6em] fill-gray-500">
					Time
				</Svg.Text>
				<Svg.G ref={ref} />
			</Svg.G>
		</ Svg.G>
	);
}