import { ScaleLinear, ScaleTime } from "d3";
import { FeatureCollection, MultiLineString } from "geojson";
import { Dispatch } from "react";


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

export type WorldType = {
  atlas: Atlas
}

export type MapType = {
  data: Migrant[]
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
  setBrushExtent: Dispatch<React.SetStateAction<Date[]>>
}

export type Store = {
  raw: Migrant[];
  migrants: Migrant[];
  atlas: Atlas | null;

  setRaw: (_: Migrant[]) => void;
  setMigrants: (_: Migrant[]) => void;
  setAtlas: (_: Atlas) => void;

  axis: {
    x: (_: Migrant) => Date,
    y: (_: Migrant) => number
  };
}