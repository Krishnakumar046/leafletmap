import { geoJsonStyle } from "../utils/map_styles";
import { GeoJSON } from "react-leaflet";

const BoothLayer = ({ acBound }: any) => {
  return (
    <div>
      <GeoJSON data={acBound} style={geoJsonStyle} />
    </div>
  );
};

export default BoothLayer;
