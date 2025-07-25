import { GeoJSON } from "react-leaflet";
import * as DistrictJson from "../constants/geojson/districts_geojson.json";
import {
  geoJsonStyle,
  highlightStyle,
  inactiveStyle,
} from "../utils/map_styles";
import type { GeoJsonObject } from "geojson";
import { useCallback, useEffect, useState } from "react";

const DistrictGeoJson = DistrictJson as GeoJsonObject;

const DistrictLayer = () => {
  const [hoveredFeatures, setHoveredFeatures] = useState<any>(null);
  useEffect(() => {}, [hoveredFeatures]);
  const getDistrictStyle = useCallback(
    (features: any) => {
      if (!hoveredFeatures) return geoJsonStyle;
      if (features.id === hoveredFeatures.id) {
        return highlightStyle;
      }
      return inactiveStyle;
    },
    [hoveredFeatures]
  );
  return (
    <GeoJSON
      data={DistrictGeoJson}
      style={getDistrictStyle}
      onEachFeature={(features, layer) => {
        layer.bindTooltip(`${features?.properties?.district}`, {
          permanent: false,
          direction: "top",
        });
        layer.on({
          click: function (e: any) {
            console.log(features, e, "district map");
          },
          mouseover: (e) => {
            const layer = e.target;
            layer.setStyle(highlightStyle);
            setHoveredFeatures(features);
          },
          mouseout: (e) => {
            const layer = e.target;
            layer.setStyle(geoJsonStyle);
            setHoveredFeatures(null);
          },
        });
      }}
    />
  );
};
export default DistrictLayer;
