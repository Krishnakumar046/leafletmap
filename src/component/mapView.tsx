import "leaflet/dist/leaflet.css";
import { MapContainer, useMap, ZoomControl } from "react-leaflet";
import { mapContainerStyle } from "../utils/map_styles";
import { useSelector } from "react-redux";
import type { RootState } from "../store/store";
import { MapToggleButton } from "../muicomponent/ToggleSwitch";
import { useEffect, useState } from "react";
import Breadcrumbs from "./Breadcrumbs";
import { AcLayer } from "../map_components/Ac_Layer";
import { MapType } from "../constants/enum";
import BoothLayer from "../map_components/Booth_Layer";
import SnackBarToast from "../muicomponent/SnackBar";
import { MapResetControl } from "../muicomponent/MapReset";
import StateLayer from "../map_components/State_Layer";
import ZoneLayer from "../map_components/Zone_Layer";
import DistrictLayer from "../map_components/District_layer";

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
  const mapState = useSelector((state: RootState) => state.mapView);
  const [mainMapState, setMainMapState] = useState(mapState);
  const [openToast, setOpenToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  useEffect(() => {
    setMainMapState(mapState);
  }, [mapState]);

  //SET THE TOAST BAR MESSAGE
  const handleToastSnackBar = (val: any, type: any) => {
    if (typeof type === "string") {
      setToastMessage(type);
      setOpenToast(val);
    }
  };
  //CLOSE THE TOAST BAR MESSAGE
  const handleClose = () => {
    setOpenToast(false);
  };

  return (
    <div className="relative">
      <SnackBarToast
        open={openToast}
        onClose={handleClose}
        message={toastMessage}
      />
      <div
        className="fixed left-5 top-[60%] transform -translate-y-1/2 w-[100% - 15%] h-calc(100% - 20%) z-10 bg-white rounded-lg shadow-sm"
        style={{
          padding: "1rem",
          borderRadius: "10px",
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
        }}
      >
        {/* TOGGLE FOR THE MAP WANTED */}
        <MapToggleButton handleToastSnackBar={handleToastSnackBar} />
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
          dragging={false}
          doubleClickZoom={true}
          zoomControl={false}
        >
          <MapResetControl />
          {/* ZOOM CONTROL FOR MAP*/}
          <ZoomControl position="topright" />

          {/* BREADCRUM OF THE MAP  */}
          <div
            className="flex h-full w-full flex-col items-start "
            style={{ marginLeft: "2.5rem", marginTop: "4.2rem" }}
          >
            {mainMapState?.mapType !== MapType.STATE &&
              mainMapState?.mapType !== MapType.ZONE &&
              mainMapState?.mapType !== MapType.DISTRICT && (
                <div className="my-4">
                  <Breadcrumbs mapState={mapState} />
                </div>
              )}
          </div>

          {/* GET MAP CENTER */}
          <MapUpdater />

          {/* STATE GEJSON */}
          {mainMapState?.mapType === MapType.STATE && <StateLayer />}

          {/* ZONE GEOJSON */}
          {mainMapState?.mapType === MapType.ZONE && <ZoneLayer />}

          {/* AC GEOJSON */}
          {mainMapState?.mapType === MapType.AC && (
            <AcLayer acBound={mapState?.acBound} />
          )}
          {mainMapState?.mapType === MapType.DISTRICT && <DistrictLayer />}

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
