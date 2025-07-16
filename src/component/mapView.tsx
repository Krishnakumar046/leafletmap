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
import center from "@turf/center";
import { type LatLngTuple } from "leaflet";
import { MapToggleButton } from "../muicomponent/ToggleSwitch";
import { useEffect, useState } from "react";
import Breadcrumbs from "./Breadcrumbs";
import { AcLayer } from "../map_components/Ac_Layer";
import { MapType } from "../constants/enum";
import { MAP_CENTER } from "../constants/map_constants";
import SnackBarToast from "../muicomponent/SnackBar";
import BoothLayer from "../map_components/Booth_Layer";
const MapUpdater = () => {
  const map = useMap();
  const { center, Zoom, mapType } = useSelector(
    (state: RootState) => state.mapView
  );

  useEffect(() => {
    if (center && Zoom) {
      map.setView(center, Zoom);
    }
  }, [mapType]);

  return null;
};

const MapView = () => {
  const dispatch = useDispatch();
  const { Zoom, acBound, mapType } = useSelector(
    (state: RootState) => state.mapView
  );
  const mapState = useSelector((state: RootState) => state.mapView);
  const [mainMapState, setMainMapState] = useState(mapState);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  useEffect(() => {
    setMainMapState(mapState);
  }, [mapState]);

  const handleStateClick = (feature: any) => {
    const features = JSON.parse(JSON.stringify(feature));

    dispatch(handleStateSelect({ features: features }));
  };

  const handleZoneClick = (feature: any) => {
    const features = JSON.parse(JSON.stringify(feature));
    console.log(features, "features");
    dispatch(handleZoneSelect({ features: features }));
  };
  function getCenterOfGeoJson(geoJson: any) {
    return center(geoJson).geometry.coordinates.reverse() as LatLngTuple;
  }

  const mapCenter: LatLngTuple = getCenterOfGeoJson(StateGeoJSON);
  console.log(mapCenter, "mapCenter");
  return (
    <div className="relative">
      <SnackBarToast
        open={snackbarOpen}
        message={snackbarMessage}
        onClose={() => setSnackbarOpen(false)}
      />
      <div
        className="fixed left-5 top-1/2 transform -translate-y-1/2 w-[15%] h-[50%] z-10 bg-white rounded-lg shadow-sm"
        style={{
          padding: "1rem",
          borderRadius: "10px",
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
        }}
      >
        <MapToggleButton
          setSnackbarMessage={setSnackbarMessage}
          setSnackbarOpen={setSnackbarOpen}
        />
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
        <MapContainer
          style={mapContainerStyle}
          center={mapState.center}
          zoom={Zoom}
          scrollWheelZoom={false}
          dragging={true}
          doubleClickZoom={true}
          zoomControl={false}
        >
          <ZoomControl position="topright" />
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
          <MapUpdater />
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
          {mainMapState?.mapType === MapType.AC && (
            <AcLayer acBound={acBound} mapState={mapState} />
          )}
          {mainMapState?.mapType === MapType.BOOTH && (
            <BoothLayer acBound={acBound} />
          )}
        </MapContainer>
      </div>
    </div>
  );
};

export default MapView;
