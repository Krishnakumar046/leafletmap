import type { LatLngTuple } from "leaflet";
import type { Feature, MyFeatureCollection } from "./types";
import center from "@turf/center";

export const padZero = (num: number | undefined | null): string => {
  if (num === undefined || num === null) return "000";
  return num.toString().padStart(3, "0");
};

export const createFeatureCollection = (features: Feature[]): any => ({
  type: "FeatureCollection",
  features,
});

export const ZoneValue = (ZoneId:number)=>{
  switch(ZoneId){
    case 0:
      return "North";
      break;
      case 1:
        return "South";
        break;
        case 2:
          return "west";
          break;
          case 3:
            return "East";
            break;
            case 4:
              return "Chennai";
              break;
  }
}
export const centerMapValue = (centerFeature:any) => {

      const newCenter = center(
        centerFeature
      ).geometry.coordinates.reverse() as LatLngTuple;

      return newCenter;
}