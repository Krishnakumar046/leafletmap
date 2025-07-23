import { GeoJSON } from "react-leaflet";
import { StateGeoJSON } from "../constants/geojson/state_geojson";
import { geoJsonStyle } from "../utils/map_styles";
import { useDispatch } from "react-redux";
import { handleStateSelect } from "../store/slices/mapViewSlice";

const StateLayer = () => {
  const dispatch = useDispatch();
  //STATE CLICKED
  const handleStateClick = (feature: any) => {
    const features = JSON.parse(JSON.stringify(feature));
    dispatch(handleStateSelect({ features: features }));
  };
  return (
    <div>
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
    </div>
  );
};

export default StateLayer;
