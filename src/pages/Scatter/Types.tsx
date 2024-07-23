import { ScaleLinear } from "d3";

export type Raw = {
	[key:string]: string | number;
}

export type Row = {
    petal_length: number;
    petal_width: number;
    sepal_length: number;
    sepal_width: number;
    species: string;
}

export type X = {
    x: ScaleLinear<number, number, never>;
    fmt?: string
}

export type Y = {
    y: ScaleLinear<number, number, never>;
}

export type Item = X & Y & {
    d: Row;
}