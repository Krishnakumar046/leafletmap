import { styled } from "@mui/material/styles";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useEffect, useState } from "react";
import {
  handleInputAcMap,
  handleInputStateMap,
  handleInputValue,
  setToggleSelect,
} from "../store/slices/mapViewSlice";
import { useDispatch, useSelector } from "react-redux";
import { MapType } from "../constants/enum";
import { MAP_TYPES, ZoneOptions } from "../constants/map_constants";
import { Box } from "@mui/material";
import Select from "react-select";
import type { RootState } from "../store/store";
import DropDownOptionValue from "./dropDownOptions";

const ToggleSwitch = styled(Switch)(({ theme }) => ({
  padding: 8,
  "& .MuiSwitch-track": {
    borderRadius: 22 / 2,
    "&::before, &::after": {
      content: '""',
      position: "absolute",
      top: "50%",
      transform: "translateY(-50%)",
      width: 16,
      height: 16,
    },
    "&::before": {
      backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 24 24"><path fill="${encodeURIComponent(
        theme.palette.getContrastText(theme.palette.primary.main)
      )}" d="M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z"/></svg>')`,
      left: 12,
    },
    "&::after": {
      backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 24 24"><path fill="${encodeURIComponent(
        theme.palette.getContrastText(theme.palette.primary.main)
      )}" d="M19,13H5V11H19V13Z" /></svg>')`,
      right: 12,
    },
  },
  "& .MuiSwitch-thumb": {
    boxShadow: "none",
    width: 16,
    height: 16,
    margin: 2,
  },
}));

export const MapToggleButton = ({ handleToastSnackBar }: any) => {
  const [mapTypes, setMapTypes] = useState([...MAP_TYPES]);
  const [selectedValue, setSelectedValue] = useState<any>({
    [MapType.STATE]: "",
    [MapType.ZONE]: "",
    [MapType.AC]: "",
    [MapType.BOOTH]: "",
  });
  const dispatch = useDispatch();
  const mapState = useSelector((state: RootState) => state.mapView);

  console.log(selectedValue, "selectedValue");

  useEffect(() => {
    //IF AC IS CURRENTLY ACTIVE CHANGE OF THE INPUT VALUE CHANGE THE MAP
    if (
      mapState.mapType === MapType.AC &&
      mapState.rootMapType === MapType.AC &&
      selectedValue[MapType.AC]
    ) {
      dispatch(handleInputAcMap({ selected: selectedValue, map: MapType.AC }));
    } else if (
      (mapState.mapType === MapType.STATE ||
        mapState.mapType === MapType.BOOTH) &&
      mapState.rootMapType === MapType.STATE &&
      selectedValue[MapType.STATE] !== ""
    ) {
      dispatch(handleInputStateMap({ selected: selectedValue }));
    } else if (
      (mapState.mapType === MapType.ZONE || mapState.mapType === MapType.AC) &&
      mapState.rootMapType === MapType.ZONE &&
      selectedValue[MapType.ZONE] !== ""
    ) {
      console.log("entered into the zone loop");

      dispatch(
        handleInputAcMap({ selected: selectedValue, map: MapType.ZONE })
      );
    }
  }, [mapState?.mapToggleSwitch, selectedValue]);

  //TOGGLE TO SHOW THE MAP
  const handleToggleChange = (map: (typeof MAP_TYPES)[0]) => {
    //IF AC IS TOGGLE WITHOUT SELECT
    if (map.id === "AC" && !selectedValue[MapType.AC]) {
      handleToastSnackBar(true, "SELECT THE VALUE IN DROPDOWN");
      return;
    }

    // GET THE CURRENT TOGGLE LENGTH
    const activeCount = mapTypes.filter((m) => m.toggleSwitch).length;

    // PREVENT DESELECT THE LAST TOGGLE OPTIONS
    if (map.toggleSwitch && activeCount <= 1) {
      return;
    }

    //UPDATE THE TOGGLE STATE
    setMapTypes((prevMapTypes) =>
      prevMapTypes.map((m) => ({
        ...m,
        toggleSwitch: m.id === map.id ? !m.toggleSwitch : false,
        input: (m.id === map.id && !m.toggleSwitch) || m.id === "AC",
      }))
    );

    //DISPATCH THE TOGGLE STATE TO THE REDUX
    dispatch(setToggleSelect({ toggle: map.id.toLowerCase() }));
  };
  return (
    <>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
        {mapTypes.map((maps, key) => (
          <Box key={key}>
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              sx={{
                width: "100%",
                py: 1,
                px: 2,
                "&:hover": { backgroundColor: "action.hover", borderRadius: 1 },
              }}
            >
              <Typography variant="body1" sx={{ flex: 1 }}>
                {maps.id}
              </Typography>
              <FormControlLabel
                control={
                  <ToggleSwitch
                    checked={maps.toggleSwitch}
                    onChange={() => handleToggleChange(maps)}
                    // disabled={maps.id === "AC" && !selectedValue}
                  />
                }
                label=""
                sx={{ marginLeft: "auto" }}
              />
            </Stack>

            {maps.input && (
              <DropDownOptionValue
                setSelectedValue={setSelectedValue}
                selectedValue={selectedValue}
                maps={maps}
              />
            )}
          </Box>
        ))}
      </Box>
    </>
  );
};
