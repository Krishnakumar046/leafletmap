import type { LatLngTuple } from "leaflet";
import type { FeatureCollection, Geometry, GeoJsonProperties } from "geojson";

export const MapType = {
  STATE: "state",
  ZONE: "zone",
  AC: "ac",
  BOOTH: "booth",
} as const;

export type MapType = typeof MapType[keyof typeof MapType];

export interface MapViewState {
  mapToggleSwitch: string;
  mapType: string;
  mapInputData:any;
  rootMapType:string;
  clickedFeature: any;
  center: LatLngTuple;
  Zoom: number;
  breadCrumbDetails: any;
  acBound: any;
}

export type MyFeatureCollection = FeatureCollection<Geometry, GeoJsonProperties>;

export interface Feature {
  properties: {
    [x: string]: any;
    REGION_NO?: number;
    AC_NO?: number;
    region_name?: string;
    AC_NAME?: string;
    BOOTH_NAME?: string;
    DIST_NAME?: string;
  };
}
