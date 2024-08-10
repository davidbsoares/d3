import { FeatureCollection, MultiLineString } from "geojson";


export type Data = {
  land: FeatureCollection,
  interiors: MultiLineString
}