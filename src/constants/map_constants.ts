import type { LatLngTuple } from "leaflet";

export const MAP_CENTER:LatLngTuple= [10.5937, 78.3265]

export const BOOTH_CENTER: LatLngTuple = [23.5937, 78.9629]; 

export const MAP_TYPES = [
  { id: "STATE", toggleSwitch: true ,input:false},
  { id: "ZONE", toggleSwitch: false ,input:false},
  { id: "AC", toggleSwitch: false ,input:true },
  { id: "DISTRICT", toggleSwitch: false ,input:false},
];

export const ZoneOptions = [
    {value: "0 NORTH",label:0},
    {value:"1 SOUTH ",label:1},
    {value:"2 WEST",label:2},
    {value:"3 DELTA",label:3},
    {value:"4 CHENNAI",label:4},
]
