import { geoNaturalEarth1, geoPath, geoGraticule, scaleSqrt, max, scaleTime, scaleLinear, extent, timeMonths, bin, sum } from "d3";

import dates from "core/dates";

import Svg from "core/ui/Svg";
import Box from "core/ui/Box";
import Loading from "core/ui/Loading";

import { useAtlas, useMigrants } from "./fabric";
import { Bin, MarksType, Migrant, XType, YType } from "./Types";


const l = {
	height: 600,
	width: 1000,
	x: (d: Migrant) => d.date,
	y: (d: Migrant) => d.total,
	margin: { top: 20, right: 30, bottom: 65, left: 90 },
	label: {
		x: 40,
		y: -50
	}
};

const inner = {
	height: l.height - l.margin.top - l.margin.bottom,
	width: l.width - l.margin.left - l.margin.right
};


const X = ({ x }: XType) => {
	return x.ticks().map((t, i) => (
		<Svg.G transform={`translate(${x(t)},0)`} key={i}>
			<Svg.Line y2={inner.height} className="stroke-gray-300" />
			<Svg.Text dy="0.71em" y={inner.height + 5} className="font-serif" textAnchor="middle">{dates.format(t, "%Y")}</Svg.Text>
		</Svg.G>
	));
};

const Y = ({ y }: YType) => y.ticks().map((t, i) => (
	<Svg.G transform={`translate(0,${y(t)})`} key={i}>
		<Svg.Line x2={inner.width} className="stroke-gray-300" />
		<Svg.Text x={-5} dy="0.32em" className="font-serif fill-gray-500" textAnchor="end">{t}</Svg.Text>
	</Svg.G>
));

const Marks = ({ x, y, binned }: MarksType) => binned.map((b, i) => (
	<Svg.Rect
		fill="#137B80"
		x={x(b.x0)}
		y={y(b.y)}
		width={x(b.x1) - x(b.x0)}
		height={inner.height - y(b.y)}
		key={i}
	/>
));

Migrants.Histogram = () => {
	const migrants = useMigrants();
	if (!migrants) return <Loading />;

	const x = scaleTime()
		.domain(extent(migrants, l.x) as [Date, Date])
		.range([0, inner.width])
		.nice();

	const y = scaleLinear()
		.domain(extent(migrants, l.y) as [number, number])
		.range([inner.height, 0])
		.nice();


	const [start, stop] = x.domain();
	const t = timeMonths(start, stop).map(d => d.getTime());

	const binned = bin()
		// @ts-expect-error: strange type limitation in bin. Investigate
		.value(l.x)
		.domain([start.getTime(), stop.getTime()])
		// @ts-expect-error: strange type limitation in bin. Investigate
		.thresholds(t)(migrants)
		.map<Bin>(array => ({
			// @ts-expect-error: strange type limitation in bin. Investigate
			y: sum(array, l.y),
			x0: array.x0 as number,
			x1: array.x1 as number
		}));

	return (
		<Box.Column>
			<Svg width={l.width} height={l.height}>
				<Svg.G transform={`translate(${l.margin.left},${l.margin.top})`}>
					<X x={x} />
					<Svg.Text textAnchor="middle" className="text-2xl fill-gray-500" transform={`translate(${l.label.y},${inner.height / 2}) rotate(-90)`}>
						Dead and Missing
					</Svg.Text>
					<Y y={y} />
					<Marks x={x} y={y} binned={binned} />
					<Svg.Text x={inner.width / 2} y={inner.height + l.label.x} textAnchor="middle" className="text-2xl fill-gray-500">
						Time
					</Svg.Text>
				</Svg.G>
			</Svg>
		</Box.Column>
	);
};

Migrants.Map = () => {
	const atlas = useAtlas();
	const migrants = useMigrants();

	if (!atlas || !migrants) return <Loading />;

	const projection = geoNaturalEarth1();
	const path = geoPath(projection);
	const graticule = geoGraticule();

	const sizeValue = (c: Migrant) => c.total;
	const sizeScale = scaleSqrt()
		.domain([0, max(migrants, sizeValue) as number])
		.range([0, 15]);

	return (
		<Box.Column >
			<Svg width={l.width} height={l.height}>
				<Svg.G>
					<Svg.Path d={path({ type: "Sphere" }) || ""} fill="#fbfbfb" />
					<Svg.Path d={path(graticule()) || ""} fill="none" stroke="#ececec" strokeWidth={0.5} />
					{atlas?.land.features.map((f, i) => {
						const p = path(f);
						return p && <Svg.Path fill="#d8d8d8" stroke="#ececec" d={p} key={i} />;
					})}
					<Svg.Path d={path(atlas.interiors) || ""} fill="none" stroke="#d9dfe0" strokeWidth={0.5} />
					{migrants.map((c, i) => {
						const l = projection(c.coordinates);
						return <Svg.Circle cx={l?.[0]} cy={l?.[1]} r={sizeScale(sizeValue(c))} fill="#137b80" opacity={0.3} key={i} />;
					})}
				</Svg.G>
			</Svg>
		</Box.Column>
	);
};

export default function Migrants() {
	return (
		<Box.Column>
			<Migrants.Map />
			<Migrants.Histogram />
		</Box.Column>
	);
}