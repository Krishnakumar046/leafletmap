import type { LatLngTuple } from "leaflet";
import type { Feature } from "./types";
import center from "@turf/center";
import { MapType } from "../constants/enum";

export const padZero = (num: number | undefined | null): string => {
  if (num === undefined || num === null) return "000";
  return num.toString().padStart(3, "0");
};

export const createFeatureCollection = (features: Feature[]): any => ({
  type: "FeatureCollection",
  features,
});

export const ZoneValue = (ZoneId:number)=>{
  console.log(ZoneId,"zoneId")
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

export const getSelectedOptions = ({selectedValue ,map}:any)=>{
  const newValue = {...selectedValue}
      if (map.id.toLowerCase() === MapType.STATE) {
        newValue[MapType.ZONE] = "";
        newValue[MapType.AC] = "";
        newValue[MapType.BOOTH] = "";
      } else if (map.id.toLowerCase() === MapType.ZONE) {
        newValue[MapType.STATE] = "";
        newValue[MapType.AC] = "";
        newValue[MapType.BOOTH] = "";
      } else if (map.id.toLowerCase() === MapType.AC) {
        newValue[MapType.STATE] = "";
        newValue[MapType.ZONE] = "";
        newValue[MapType.BOOTH] = "";
      } else {
        newValue[MapType.STATE] = "";
        newValue[MapType.ZONE] = "";
        newValue[MapType.AC] = "";
      }
      return newValue;
}