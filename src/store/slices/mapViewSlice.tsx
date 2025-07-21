import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { MAP_CENTER } from "../../constants/map_constants";
import { ConstituenciesGeoJSON } from "../../constants/geojson/constituencies_geojson";
import type { LatLngTuple } from "leaflet";
import center from "@turf/center";
import type { MapViewState, MyFeatureCollection } from "../../utils/types";
import { MapType } from "../../constants/enum";
import { centerMapValue, ZoneValue } from "../../utils/utils";

const initialState: MapViewState = {
  mapToggleSwitch: MapType.STATE,
  mapType: MapType.STATE,
  mapInputData: {
    [MapType.STATE]: "",
    [MapType.ZONE]: "",
    [MapType.AC]: "",
    [MapType.DISTRICT]: "",
  },
  rootMapType: MapType.STATE,
  acBound: null,
  center: MAP_CENTER,
  Zoom: 7,
  breadCrumbDetails: {
    [MapType.STATE]: "",
  },
  clickedFeature: null,
};

const mapViewSlice = createSlice({
  name: "mapView",
  initialState,
  reducers: {
    //HANDLE STATE SELECT
    handleStateSelect: (state, action: PayloadAction<{ features: any }>) => {
      const { features } = action.payload;
      const filteredFeatures = ConstituenciesGeoJSON.features.filter(
        (f: any) => f.properties.AC_NO === features.properties.AC_NO
      );
      const stateToBoothGeoJson: MyFeatureCollection = {
        type: "FeatureCollection",
        features: filteredFeatures,
      };
      const newCenter = centerMapValue(stateToBoothGeoJson);
      console.log(newCenter, "newCenter");
      Object.assign(state, {
        clickedFeature: features,
        acBound: stateToBoothGeoJson,
        mapType: MapType.BOOTH,
        Zoom: 11,
        center: newCenter,
        breadCrumbDetails: {
          [MapType.STATE]:
            stateToBoothGeoJson?.features[0]?.properties?.AC_NAME,
        },
      });
    },
    // HANDLE ZONE SELECT
    handleZoneSelect: (state, action: PayloadAction<{ features: any }>) => {
      const { features } = action.payload;
      const filteredFeatures = ConstituenciesGeoJSON.features.filter(
        (f: any) => f.properties?.REGION_NO === features?.properties?.REGION_NO
      );

      const zoneToAcGeoJson: MyFeatureCollection = {
        type: "FeatureCollection",
        features: filteredFeatures,
      };
      const newCenter = centerMapValue(zoneToAcGeoJson);

      Object.assign(state, {
        clickedFeature: features,
        acBound: zoneToAcGeoJson,
        mapType: MapType.AC,
        Zoom: 8,
        center: newCenter,
        breadCrumbDetails: {
          [MapType.ZONE]: features?.properties?.DISTRICT,
        },
      });
    },
    // HANDLE AC SELECT
    handleAcClicked: (state, action: PayloadAction<{ features: any }>) => {
      const { features } = action.payload;
      const filteredFeatures = ConstituenciesGeoJSON.features.filter(
        (f: any) => f.properties.AC_NO === features.properties.AC_NO
      );

      const acToBoothGeoJson: MyFeatureCollection = {
        type: "FeatureCollection",
        features: filteredFeatures,
      };

      const newCenter = centerMapValue(acToBoothGeoJson);

      Object.assign(state, {
        clickedFeature: features,
        acBound: acToBoothGeoJson,
        mapType: MapType.BOOTH,
        Zoom: 11,
        center: newCenter,
        breadCrumbDetails: {
          ...state.breadCrumbDetails,
          [MapType.AC]: features?.properties?.AC_NAME,
        },
      });
    },
    // HANDLE INPUT CHANGE MAP GETS THE CHANGE
    handleInputAcMap: (state, action: PayloadAction<{ selected: any }>) => {
      const { selected } = action.payload;

      const filteredFeatures = ConstituenciesGeoJSON.features.filter(
        (f: any) => f.properties?.REGION_NO === selected.label
      );
      if (filteredFeatures.length === 0) {
        console.error("No features found for region:", selected.label);
        return state;
      }

      const InputAcToBoothGeoJson: MyFeatureCollection = {
        type: "FeatureCollection",
        features: filteredFeatures,
      };

      try {
        const newCenter = centerMapValue(InputAcToBoothGeoJson);
        return {
          ...state,
          clickedFeature: null,
          acBound: InputAcToBoothGeoJson,
          mapType: MapType.AC,
          Zoom: 8,
          center: newCenter,
          breadCrumbDetails: {
            [MapType.ZONE]: ZoneValue(selected.label),
          },
        };
      } catch (error) {
        console.error("Error calculating center:", error);
        return state;
      }
    },
    //RESET OF THE MAP ON THE BOTH ZONE AND THE STATE
    handleResetMap: (state, action: PayloadAction<{ type: string }>) => {
      const { type } = action.payload;
      if (type === MapType.STATE) {
        Object.assign(state, {
          mapType: MapType.STATE,
          clickedFeature: null,
          acBound: null,
          Zoom: 7,
          center: MAP_CENTER,

          breadCrumbDetails: {
            [type]: "",
          },
        });
      } else if (type === MapType.ZONE) {
        Object.assign(state, {
          mapType: MapType.ZONE,
          clickedFeature: null,
          // acBound: null,
          Zoom: 7,
          center: MAP_CENTER,

          breadCrumbDetails: {
            [type]: "",
          },
        });
      }
    },
    //BREADCRUMB OF THE CLICKED
    handleBreadCrumClick: (
      state,
      action: PayloadAction<{ type: string; mapState: any }>
    ) => {
      const { type, mapState } = action.payload;

      if (type === MapType.ZONE) {
        const filteredFeatures = ConstituenciesGeoJSON.features.filter(
          (f: any) =>
            f.properties?.REGION_NO ===
            mapState?.clickedFeature?.properties?.REGION_NO
        );
        const boothToAcGeoJson: MyFeatureCollection = {
          type: "FeatureCollection",
          features: filteredFeatures,
        };
        const newCenter = centerMapValue(boothToAcGeoJson);
        Object.assign(state, {
          mapType: MapType.AC,
          acBound: boothToAcGeoJson,
          Zoom: 8,
          center: newCenter,
          breadCrumbDetails: Object.fromEntries(
            Object.entries(state.breadCrumbDetails).filter(
              ([key]) => key !== MapType.BOOTH && key !== MapType.AC
            )
          ),
        });
      }
    },
    //IN THE AC THE INPUT CHANGE
    handleInputValue: (
      state,
      action: PayloadAction<{ selected: any; maps: any }>
    ) => {
      const { selected, maps } = action.payload;
      state.mapInputData = {
        ...state.mapInputData,
        [maps.id.toLowerCase()]: selected.value,
      };
    },
    // HANDLE TOGGLE SELECT
    setToggleSelect: (state, action: PayloadAction<{ toggle: string }>) => {
      const { toggle } = action.payload;

      Object.assign(state, {
        mapToggleSwitch: toggle,
        mapType: toggle,
        rootMapType: toggle,
        Zoom: 7,
        center: MAP_CENTER,
        breadCrumbDetails: {
          [toggle]: "",
        },
      });
    },
  },
});

export const {
  handleStateSelect,
  handleZoneSelect,
  handleAcClicked,
  setToggleSelect,
  handleResetMap,
  handleBreadCrumClick,
  handleInputValue,
  handleInputAcMap,
} = mapViewSlice.actions;
export default mapViewSlice.reducer;
