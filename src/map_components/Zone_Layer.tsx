import { GeoJSON } from "react-leaflet";
import { ZonesGeoJSON } from "../constants/geojson/zone_geojson";
import { geoJsonStyle } from "../utils/map_styles";
import { useDispatch } from "react-redux";
import { handleZoneSelect } from "../store/slices/mapViewSlice";

const ZoneLayer = () => {
  const dispatch = useDispatch();
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
    </div>
  );
};

export default ZoneLayer;
