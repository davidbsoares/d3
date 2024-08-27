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
  height: number;
}

export type YType = {
  y: ScaleLinear<number, number, never>;
  width: number;
}

export type MarksType = {
  x: ScaleTime<number, number, never>;
  y: ScaleLinear<number, number, never>;
  height: number;
  binned: Bin[];
}

export type Bin = {
  y: number;
  x0: number;
  x1: number;
}

export type HistogramType = {
  height: number;
  width: number;
  position: number;
}

export type Store = {
  raw: Migrant[];
  migrants: Migrant[];
  atlas: Atlas | null;
  extent: Date[];

  setRaw: (_: Migrant[]) => void;
  setMigrants: (_: Migrant[]) => void;
  setAtlas: (_: Atlas) => void;
  setExtent: (_: Date[]) => void;

  axis: {
    x: (_: Migrant) => Date,
    y: (_: Migrant) => number
  };
}