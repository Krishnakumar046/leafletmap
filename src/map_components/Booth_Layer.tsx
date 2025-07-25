import { useCallback, useEffect, useRef, useState } from "react";
import { geoJsonStyle } from "../utils/map_styles";
import { GeoJSON } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import type { Feature, Point } from "geojson";
import { createFeatureCollection, padZero } from "../utils/utils";

const BoothLayer = ({ acBound }: { acBound: GeoJSON.FeatureCollection }) => {
  const [boothData, setBoothData] = useState<any[]>([]);
  const layerRef: any = useRef<L.GeoJSON | null>(null);
  const [key, setKey] = useState(0); // KEY WHICH RENDERED THE MAP

  // USEEFFECT WHICH LOADS ALL THE BOOTH POINT INSIDE THE BOOTH
  useEffect(() => {
    const loadBoothData = async () => {
      try {
        if (layerRef.current) {
          layerRef.current.remove();
          layerRef.current = null;
        }

        if (!acBound?.features?.length) {
          setBoothData([]);
          return;
        }

        const acNo = acBound.features[0]?.properties?.AC_NO;
        if (acNo === undefined) {
          setBoothData([]);
          return;
        }
        console.log(acNo, "boothJson acNo");

        try {
          // PADZERO WHICH GIVE PREFIX VALUE TO THE BOOTH FILE EX:001
          const paddedAcNo = padZero(
            typeof acNo === "number" ? acNo : parseInt(acNo, 10)
          );

          // BOOTHJSON WHICH GIVES THE BOOTH JSON FILE EX:001.JSON
          const boothJson = await import(
            `../constants/geojson/booths/${paddedAcNo}.json`
          );
          // FILTERED THE BOOTHJSON FEATURES
          const filteredBoothFeatures = boothJson?.default?.features;

          //COMBINE ACBOUND FEATURE AND THEN THE BOOTHJSON FEATURES
          const updatedFeatures = [
            ...acBound.features,
            ...filteredBoothFeatures,
          ];
          setBoothData(updatedFeatures);
          setKey((prev) => prev + 1);

          //FORCE RENDERED OF GEOJSON
        } catch (importError) {
          console.warn(`No booth data file found for AC ${acNo}`);
          setBoothData(acBound.features);
        }
      } catch (err) {
        console.error(`Error loading booth data:`, err);
        setBoothData([]);
      } finally {
      }
    };

    // LOADBOOTHDATA ON THE INITIAL RENDERED
    loadBoothData();
  }, [acBound]);

  // CUSTOMDIVICON WHICH GIVES THE MARKER ICON
  const customDivIcon = useCallback(
    (color: string, boothNo: string, resultColor: string) => {
      return L.divIcon({
        html: `
        <div title="Booth ${boothNo}" class="hover:translate-x-[4px] hover:translate-y-[-10px] hover:rotate-[20deg]" style="
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          border: 0;
          background: transparent;
          z-index: 1000;
          position: relative;
          transition: all 0.2s ease-in-out;
        " class="custom-booth-marker-content">
          <span style="position: relative; display: flex; height: 14px; width: 12px;">
            <span style="
              position: absolute;
              display: inline-flex;
              height: 80%;
              width: 80%;
              border-radius: 50%;
              background-color: ${resultColor};
              opacity: 0.75;
              animation: ping 1s cubic-bezier(0, 0, 0.2, 1) infinite;
            "></span>
            <span style="
              position: relative;
              display: inline-flex;
              border-radius: 50%;
              height: 12px;
              width: 12px;
              outline: 2px solid white;
              background-color: ${color};
            ">
              <span style="
                position: absolute;
                background: white;
                border-radius: 50%;
                height: 3px;
                width: 3px;
                left: 5px;
                top: 5px;
              "></span>
            </span>
          </span>
          <div style="
            height: 10px;
            width: 1.2px;
            background: black;
            outline: 2px solid white;
          "></div>
        </div>`,
        iconSize: [1, 1],
        iconAnchor: [1, 1],
        className: "custom-booth-marker",
      });
    },
    []
  );

  // POINTMARKER RETURN MARKER ON THE BOOTH NO
  const pointMarker = useCallback(
    (feature: Feature<Point>, latlng: L.LatLng): L.Layer => {
      const boothNo = feature.properties?.booth_no;

      return L.marker(latlng, {
        icon: customDivIcon("#FF0000", boothNo?.toString() || "N/A", "#FFFF00"),
        interactive: true,
      });
    },
    [customDivIcon]
  );
  if (!acBound?.features?.length) return null;

  return (
    <GeoJSON
      key={key}
      ref={layerRef}
      data={createFeatureCollection(boothData)}
      style={geoJsonStyle}
      pointToLayer={pointMarker}
      onEachFeature={(feature, layer) => {
        if (feature.properties?.booth_no) {
          // SHOWS THE TOOLTIP OF THE BOOTH
          layer.bindTooltip(`Booth: ${feature.properties.booth_no}`, {
            permanent: false,
            direction: "top",
          });
        }
      }}
    />
  );
};

export default BoothLayer;
