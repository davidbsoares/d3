import { ScaleLinear, ScaleTime } from "d3";

export type Raw = {
	[key:string]: string | number;
}

export type Row = {
    timestamp: Date;
    temperature: number;
}

export type X = {
    x: ScaleTime<number, number, never>;
    fmt?: string
}

export type Y = {
    y: ScaleLinear<number, number, never>;
}

export type Marks = X & Y & {
    data: Row[];
}