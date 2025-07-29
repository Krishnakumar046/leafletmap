import L from "leaflet";
import { GeoJSON } from "react-leaflet";
import { ZonesGeoJSON } from "../constants/geojson/zone_geojson";
import {
  defaultStyle,
  geoJsonStyle,
  greyedOutStyle,
  highlightStyle,
} from "../utils/map_styles";
import { useDispatch } from "react-redux";
import { handleZoneSelect } from "../store/slices/mapViewSlice";
import { useState } from "react";

const ZoneLayer = () => {
  const dispatch = useDispatch();
  const [hoveredFeatures, setHoveredFeatures] = useState<any>(null);
  //ZONE CLICKED
  const handleZoneClick = (feature: any) => {
    const features = JSON.parse(JSON.stringify(feature));
    dispatch(handleZoneSelect({ features: features }));
  };
  return (
    <div>
      {" "}
      <GeoJSON
        data={ZonesGeoJSON}
        style={geoJsonStyle}
        onEachFeature={(feature, layer) => {
          layer.bindTooltip(`${feature?.properties?.DISTRICT}`, {
            permanent: false,
            direction: "top",
          });
          layer.on({
            click: (e: L.LeafletMouseEvent) => {
              handleZoneClick(feature);
              (e.target as L.Path).setStyle({
                fillColor: "#ff7800",
                weight: 2,
                color: "#666",
                fillOpacity: 0.7,
              });
            },
            mouseover: (e) => {
              const layer = e.target;
              layer.setStyle(highlightStyle);
            },
            mouseout: (e: L.LeafletMouseEvent) => {
              const layer = e.target;
              layer.setStyle(geoJsonStyle);
            },
          });
        }}
      />
    </div>
  );
};

export default ZoneLayer;
