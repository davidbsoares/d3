import { ScaleLinear, ScaleOrdinal } from "d3";

export type Raw = {
    [key: string]: string | number;
}

export type Row = {
    petal_length: number;
    petal_width: number;
    sepal_length: number;
    sepal_width: number;
    species: string;
}

export type Values = "petal_length" | "petal_width" | "sepal_length" | "sepal_width"

export type FilterType = {
    x: Values,
    y: Values
}

export type X = {
    x: ScaleLinear<number, number, never>;
    fmt?: string
}

export type Y = {
    y: ScaleLinear<number, number, never>;
}

export type Color = {
    color: ScaleOrdinal<string, string, never>
}

export type Scale = X & Y & Color

export type Marks = {
    data: Row[];
    filter: FilterType;
    scale: Scale
}

export type LegendType = Color & {
    size?: number;
    spacing?: number;
    offset?: number
}

export type S = {
    filter: "x" | "y"
    setFilter: React.Dispatch<React.SetStateAction<FilterType>>;
}