import { ScaleLinear, ScaleTime } from "d3";
import { FeatureCollection, MultiLineString } from "geojson";


export type Atlas = {
  land: FeatureCollection,
  interiors: MultiLineString
}

export type MigrantRaw = {
  "Location Coordinates": string;
  "Total Dead and Missing": string;
  "Reported Date": string;
}

export type Migrant = {
  coordinates: [number, number];
  total: number;
  date: Date;
}

export type XType = {
  x: ScaleTime<number, number, never>;
}

export type YType = {
  y: ScaleLinear<number, number, never>;
}

export type Bin = {
  y: number;
  x0: number;
  x1: number;
}

export type MarksType = XType & YType & {
  binned: Bin[]
}