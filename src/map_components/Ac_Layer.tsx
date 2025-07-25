import { GeoJSON } from "react-leaflet";
import L from "leaflet";
import { useDispatch } from "react-redux";
import { handleAcClicked } from "../store/slices/mapViewSlice";
import {
  defaultStyle,
  geoJsonStyle,
  greyedOutStyle,
  highlightStyle,
} from "../utils/map_styles";
import { createFeatureCollection } from "../utils/utils";
import { useEffect, useRef, useState } from "react";

export const AcLayer = ({ acBound }: any) => {
  const dispatch = useDispatch();
  const tempLayersRef = useRef<L.Path[]>([]);
  const [layers, setLayers] = useState<L.Path[]>([]);

  // AC CLICKED
  const handleAcClick = (feature: any) => {
    const features = JSON.parse(JSON.stringify(feature));
    dispatch(handleAcClicked({ features: features }));
  };

  // GEO JSON KEY FOR RENDERED OF THE MAP
  const geoJsonKey = acBound?.features?.[0]?.properties?.AC_NO
    ? `ac-layer-${acBound.features[0].properties.AC_NO}-${Date.now()}`
    : "ac-layer-default";

  useEffect(() => {
    setLayers(tempLayersRef.current);
  }, [geoJsonKey]);

  return (
    <GeoJSON
      key={geoJsonKey}
      data={createFeatureCollection(acBound.features)}
      style={geoJsonStyle}
      onEachFeature={(feature, layer) => {
        const path = layer as L.Path;
        setLayers((prev) => [...prev, path]);
        // BINDTOOLTIP FOR THE TOOLTIP AT TOP
        layer.bindTooltip(`${feature?.properties?.DIST_NAME}`, {
          permanent: false,
          direction: "top",
        });
        // CLICK OF THE MAP
        layer.on({
          click: (e: L.LeafletMouseEvent) => {
            handleAcClick(feature);
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
            tempLayersRef.current.forEach((l) => {
              if (l !== path) l.setStyle(greyedOutStyle);
            });
            path.setStyle(highlightStyle);
          },
          mouseout: () => {
            tempLayersRef.current.forEach((l) => l.setStyle(defaultStyle));
          },
        });
      }}
    />
  );
};
