import { FaHandPaper, FaUndo } from "react-icons/fa";
import { useMap } from "react-leaflet";
import {
  AC_ZOOM,
  BOOTH_CENTER,
  BOOTH_ZOOM,
  MAP_CENTER,
  MAP_ZOOM,
} from "../constants/map_constants";
import { useSelector } from "react-redux";
import type { RootState } from "../store/store";
import { MapType } from "../utils/types";
import { useState } from "react";

export const MapResetControl = () => {
  const map = useMap();
  const [canDrag, setCanDrag] = useState<boolean>(false);
  const mapState = useSelector((state: RootState) => state.mapView);

  const handleReset = () => {
    if (
      mapState.mapType === MapType.STATE ||
      mapState.mapType === MapType.ZONE
    ) {
      map.setView(MAP_CENTER, MAP_ZOOM);
    } else if (mapState.mapType === MapType.BOOTH) {
      map.setView(mapState?.center, BOOTH_ZOOM);
    } else if (mapState.mapType === MapType.AC) {
      map.setView(mapState?.center, AC_ZOOM);
    }
  };

  const handleDrag = () => {
    setCanDrag(!canDrag);
    if (canDrag) {
      handleReset();
      map.dragging.disable();
      return;
    }
    map.dragging.enable();
  };
  return (
    <div className="flex">
      <button
        title="Recenter"
        aria-label="map_recenter_button"
        name="map_recenter_button"
        className="absolute top-5 right-15 z-[1000] bg-white !p-3 rounded hover:bg-gray-100 text-xl "
        style={{ boxShadow: "0 0 2px 2px lightgrey" }}
        onClick={handleReset}
      >
        <FaUndo className={"text-[1rem]"} />
      </button>
      <button
        aria-label="map_dragger_button"
        name="map_dragger_button"
        title="Enable Drag Mode"
        className="absolute top-5 right-30 5xl:right-[4.5rem] z-[1000] bg-white !p-3 rounded hover:bg-gray-100 text-xl"
        style={{ boxShadow: "0 0 2px 2px lightgrey" }}
        onClick={handleDrag}
      >
        <FaHandPaper
          className={
            " text-[1rem] 5xl:text-[1.8rem] " +
            (canDrag ? "text-gray-400 rotate-[25deg]" : "")
          }
        />
      </button>
    </div>
  );
};
