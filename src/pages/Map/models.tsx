import { FeatureCollection, MultiLineString } from "geojson";


export type Atlas = {
  land: FeatureCollection,
  interiors: MultiLineString
}

export type CityRaw = {
  city: string;
  country: string;
  lat: string;
  lng: string;
  population: string;
}

export type City = {
  city: string;
  country: string;
  lat: number;
  lng: number;
  population: number;
}


export type Store = {
  cities: City[];
  atlas: Atlas | null;

  setCities: (_: City[]) => void;
  setAtlas: (_: Atlas) => void;

  axis: {
    size: (_: City) => number
  };
}