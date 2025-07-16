import { GeoJSON, useMap } from "react-leaflet";
import L from "leaflet";
import { useDispatch, useSelector } from "react-redux";
import { handleAcClicked } from "../store/slices/mapViewSlice";
import { geoJsonStyle } from "../utils/map_styles";
import { useEffect, useRef, useState } from "react";
import type { Feature } from "../utils/types";
import { createFeatureCollection, padZero } from "../utils/utils";
import type { RootState } from "../store/store";

export const AcLayer = ({ acBound, mapState }: any) => {
  const [AcData, setAcData] = useState<Feature[]>([]);
  const layerRef = useRef<L.GeoJSON | null>(null);
  const { center, Zoom } = useSelector((state: RootState) => state.mapView);
  const map = useMap();
  const dispatch = useDispatch();

  useEffect(() => {
    if (center && Zoom) {
      map.setView(center, Zoom);
    }
  }, [mapState?.mapType]);

  const handleAcClick = (feature: any) => {
    const features = JSON.parse(JSON.stringify(feature));
    dispatch(handleAcClicked({ features: features }));
  };

  useEffect(() => {
    let isMounted = true;

    const loadBoothData = async () => {
      try {
        // Clear previous data immediately when acBound changes
        if (isMounted) setAcData(acBound?.features || []);

        if (!acBound?.features?.length) return;

        const acNo = acBound.features[0]?.properties?.AC_NO;
        if (acNo === undefined || acNo === null) return;

        const acNumber = typeof acNo === "number" ? acNo : parseInt(acNo, 10);
        if (isNaN(acNumber)) {
          console.error("Invalid AC number format:", acNo);
          return;
        }

        const paddedAcNo = padZero(acNumber);
        const boothJson = await import(
          `@/constants/geojsons/booths/${paddedAcNo}.json`
        );

        if (isMounted) {
          setAcData([...acBound.features, ...boothJson.default.features]);
        }
      } catch (error) {
        console.error("Error loading booth data:", error);
        if (isMounted) setAcData(acBound?.features || []);
      }
    };

    loadBoothData();

    return () => {
      isMounted = false;
    };
  }, [acBound]);

  // Use a more reliable key for GeoJSON
  const geoJsonKey = acBound?.features?.[0]?.properties?.AC_NO
    ? `ac-layer-${acBound.features[0].properties.AC_NO}-${Date.now()}`
    : "ac-layer-default";

  return (
    <GeoJSON
      key={geoJsonKey} // Force re-render with unique key
      ref={layerRef}
      data={createFeatureCollection(AcData)}
      style={geoJsonStyle}
      onEachFeature={(feature, layer) => {
        layer.bindTooltip(`${feature?.properties?.DIST_NAME}`, {
          permanent: false,
          direction: "top",
        });
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
      }}
    />
  );
};
