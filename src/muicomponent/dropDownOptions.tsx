import { Box } from "@mui/material";
import Select from "react-select";
import {
  ac_name_key,
  ac_no_key,
  region_name_key,
  region_no_key,
} from "../constants/map_constants";
import { useDispatch, useSelector } from "react-redux";
import { handleInputValue } from "../store/slices/mapViewSlice";
import { useEffect, useState } from "react";
import type { RootState } from "../store/store";
import { MapType } from "../constants/enum";
import { StateGeoJSON } from "../constants/geojson/state_geojson";
import { ZonesGeoJSON } from "../constants/geojson/zone_geojson";

const DropDownOptionValue = ({
  maps,
  setSelectedValue,
  selectedValue,
}: any) => {
  const dispatch = useDispatch();
  const [options, setOptions] = useState<any>({
    [MapType.STATE]: [],
    [MapType.ZONE]: [],
    [MapType.AC]: [],
    [MapType.DISTRICT]: [],
    [MapType.BOOTH]: [],
  }); // Initialize as empty array
  const mapState = useSelector((state: RootState) => state.mapView);

  const sortByValue = (options: any) => {
    return options.sort((a: any, b: any) => a.value - b.value);
  };

  function getOptionData(
    featureData: any,
    _key: string,
    _value: string,
    mapType: any
  ) {
    const newOptions = featureData.map((items: any) => {
      const property = items.properties;
      return {
        label: `${property[_key]} ${property[_value]}`,
        value: property[_key],
      };
    });
    setOptions((prevOptions: any) => ({
      ...prevOptions,
      [mapType]: sortByValue(newOptions),
    }));
  }

  useEffect(() => {
    getOptionData(StateGeoJSON.features, ac_no_key, ac_name_key, [
      MapType.STATE,
    ]);
    getOptionData(ZonesGeoJSON.features, region_no_key, region_name_key, [
      MapType.ZONE,
    ]);
    getOptionData(ZonesGeoJSON.features, region_no_key, region_name_key, [
      MapType.AC,
    ]);
  }, [mapState.mapType]);

  const handleInputChange = (selected: any) => {
    setSelectedValue((selectedValue: any) => ({
      ...selectedValue,
      [maps.id.toLowerCase()]: selected,
    }));
    dispatch(handleInputValue({ selected, maps }));
  };

  return (
    <Box sx={{ pl: 2, pr: 2, pb: 1, width: "100%" }}>
      <Select
        options={options[maps.id.toLowerCase()]}
        getOptionLabel={(option) => option.label}
        // getOptionValue={(option) => option.value}
        placeholder={`Select ${maps.id}`}
        menuPlacement="auto"
        styles={{
          control: (base) => ({
            ...base,
            minHeight: "36px",
            backgroundColor:
              maps.id === "AC" && maps.toggleSwitch
                ? "rgba(0, 0, 0, 0.05)"
                : "inherit",
          }),
        }}
        onChange={handleInputChange}
        value={selectedValue[maps.id]}
        isDisabled={maps.id === "AC" && !selectedValue}
      />
    </Box>
  );
};

export default DropDownOptionValue;
