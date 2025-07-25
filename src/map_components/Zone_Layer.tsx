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
  const [layers, setLayers] = useState<L.Path[]>([]);

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
          const path = layer as L.Path;
          setLayers((prev) => [...prev, path]);
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
            mouseout: (e: L.LeafletMouseEvent) => {
              (e.target as L.Path).setStyle(geoJsonStyle);
            },
          });
          path.on({
            mouseover: () => {
              layers.forEach((l) => {
                if (l !== path) l.setStyle(greyedOutStyle);
              });
              path.setStyle(highlightStyle);
            },
            mouseout: () => {
              layers.forEach((l) => l.setStyle(defaultStyle));
            },
          });
        }}
      />
    </div>
  );
};

export default ZoneLayer;
