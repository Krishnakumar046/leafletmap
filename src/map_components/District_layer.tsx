import { GeoJSON } from "react-leaflet";
import * as DistrictJson from "../constants/geojson/districts_geojson.json";
import { geoJsonStyle, highlightStyle } from "../utils/map_styles";
import type { GeoJsonObject } from "geojson";

//MAKING THE JSON OF THE VALUE TO THE GEOJSONOBJECT
const DistrictGeoJson = DistrictJson as GeoJsonObject;

const DistrictLayer = () => {
  return (
    <GeoJSON
      data={DistrictGeoJson}
      style={geoJsonStyle}
      onEachFeature={(features, layer) => {
        layer.bindTooltip(`${features?.properties?.district}`, {
          permanent: false,
          direction: "top",
        });
        layer.on({
          click: function (e: any) {
            console.log(features, e, "district map");
          },
          //MOUSE OVER THE HOVER OF THE COLOR
          mouseover: (e) => {
            const layer = e.target;
            layer.setStyle(highlightStyle);
          },
          //GETS TO THE DEFAULT COLOR
          mouseout: (e) => {
            const layer = e.target;
            layer.setStyle(geoJsonStyle);
          },
        });
      }}
    />
  );
};
export default DistrictLayer;
