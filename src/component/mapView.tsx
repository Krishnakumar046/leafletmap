import "leaflet/dist/leaflet.css";
import { GeoJSON, MapContainer, useMap, ZoomControl } from "react-leaflet";
import { StateGeoJSON } from "../constants/geojson/state_geojson";
import { ZonesGeoJSON } from "../constants/geojson/zone_geojson";
import { geoJsonStyle, mapContainerStyle } from "../utils/map_styles";
import { useDispatch, useSelector } from "react-redux";
import {
  handleStateSelect,
  handleZoneSelect,
} from "../store/slices/mapViewSlice";
import type { RootState } from "../store/store";
import { MapToggleButton } from "../muicomponent/ToggleSwitch";
import { useEffect, useState } from "react";
import Breadcrumbs from "./Breadcrumbs";
import { AcLayer } from "../map_components/Ac_Layer";
import { MapType } from "../constants/enum";
import BoothLayer from "../map_components/Booth_Layer";

//MAPUPDATER TO GET THE MAP CENTER
const MapUpdater = () => {
  const map = useMap();
  const mapState = useSelector((state: RootState) => state.mapView);

  useEffect(() => {
    if (mapState?.center && mapState?.Zoom) {
      map.setView(mapState?.center, mapState?.Zoom);
    }
  }, [mapState]);

  return null;
};

const MapView = () => {
  const dispatch = useDispatch();
  const mapState = useSelector((state: RootState) => state.mapView);
  const [mainMapState, setMainMapState] = useState(mapState);

  useEffect(() => {
    setMainMapState(mapState);
  }, [mapState]);

  //STATE CLICKED
  const handleStateClick = (feature: any) => {
    const features = JSON.parse(JSON.stringify(feature));
    dispatch(handleStateSelect({ features: features }));
  };

  //ZONE CLICKED
  const handleZoneClick = (feature: any) => {
    const features = JSON.parse(JSON.stringify(feature));
    console.log(features, "features");
    dispatch(handleZoneSelect({ features: features }));
  };

  return (
    <div className="relative">
      <div
        className="fixed left-5 top-1/2 transform -translate-y-1/2 w-[15%] h-[50%] z-10 bg-white rounded-lg shadow-sm"
        style={{
          padding: "1rem",
          borderRadius: "10px",
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
        }}
      >
        {/* TOGGLE FOR THE MAP WANTED */}
        <MapToggleButton />
      </div>
      <div
        style={{
          height: "100vh",
          width: "100vw",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {/* MAP CONTAINER WRAP OF GEOJSON */}
        <MapContainer
          style={mapContainerStyle}
          center={mapState.center}
          zoom={mapState?.Zoom}
          scrollWheelZoom={false}
          dragging={true}
          doubleClickZoom={true}
          zoomControl={false}
        >
          {/* ZOOM CONTROL FOR MAP*/}
          <ZoomControl position="topright" />

          {/* BREADCRUM OF THE MAP  */}
          <div
            className="flex h-full w-full flex-col items-start "
            style={{ marginLeft: "2.5rem", marginTop: "4.2rem" }}
          >
            {mainMapState?.mapType !== MapType.STATE &&
              mainMapState?.mapType !== MapType.ZONE && (
                <div className="my-4">
                  <Breadcrumbs mapState={mapState} />
                </div>
              )}
          </div>

          {/* GET MAP CENTER */}
          <MapUpdater />

          {/* STATE GEJSON */}
          {mainMapState?.mapType === MapType.STATE && (
            <GeoJSON
              data={StateGeoJSON}
              style={geoJsonStyle}
              onEachFeature={(feature, layer) => {
                layer.bindTooltip(`${feature?.properties?.AC_NAME}`, {
                  permanent: false,
                  direction: "top",
                });
                layer.on({
                  click: (e: L.LeafletMouseEvent) => {
                    handleStateClick(feature);
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
          )}

          {/* ZONE GEOJSON */}
          {mainMapState?.mapType === MapType.ZONE && (
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
                });
              }}
            />
          )}

          {/* AC GEOJSON */}
          {mainMapState?.mapType === MapType.AC && (
            <AcLayer acBound={mapState?.acBound} />
          )}

          {/* BOOTH GEOJSON */}
          {mainMapState?.mapType === MapType.BOOTH && (
            <BoothLayer acBound={mapState?.acBound} />
          )}
        </MapContainer>
      </div>
    </div>
  );
};

export default MapView;
