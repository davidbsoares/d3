import { ScaleBand, ScaleLinear } from "d3";

export type Row = {
	[key:string]: string;
}

export type X = {
    x: ScaleLinear<number, number, never>;
    fmt?: string
}

export type Y = {
    y: ScaleBand<string>;
}

export type Item = X & Y & {
    d: Row;
}