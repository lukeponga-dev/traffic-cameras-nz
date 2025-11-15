import type { SpeedCamera } from "./types";

export const cameras: SpeedCamera[] = [
  {
    id: "akl-001",
    road_name: "SH1 - Auckland Harbour Bridge",
    region: "Auckland",
    latitude: -36.8663,
    longitude: 174.7758,
    camera_type: "Fixed",
    speed_limit: 80,
    status: "Active",
    enforcement_start: "2023-01-15T00:00:00Z",
    last_updated: "2024-05-20T10:30:00Z"
  },
  {
    id: "akl-002",
    road_name: "Great South Road, Greenlane",
    region: "Auckland",
    latitude: -36.9015,
    longitude: 174.8099,
    camera_type: "Fixed",
    speed_limit: 50,
    status: "Active",
    enforcement_start: "2022-11-01T00:00:00Z",
    last_updated: "2024-05-18T14:00:00Z"
  },
  {
    id: "wgn-001",
    road_name: "Aotea Quay",
    region: "Wellington",
    latitude: -41.2836,
    longitude: 174.7761,
    camera_type: "Average",
    speed_limit: 60,
    status: "Active",
    enforcement_start: "2023-05-20T00:00:00Z",
    last_updated: "2024-05-21T09:00:00Z"
  },
  {
    id: "wgn-002",
    road_name: "Adelaide Road, Newtown",
    region: "Wellington",
    latitude: -41.3168,
    longitude: 174.7699,
    camera_type: "Fixed",
    speed_limit: 50,
    status: "Inactive",
    enforcement_start: "2021-09-10T00:00:00Z",
    last_updated: "2023-12-01T11:45:00Z"
  },
  {
    id: "chc-001",
    road_name: "Linwood Ave",
    region: "Christchurch",
    latitude: -43.5135,
    longitude: 172.6465,
    camera_type: "Fixed",
    speed_limit: 50,
    status: "Active",
    enforcement_start: "2023-03-12T00:00:00Z",
    last_updated: "2024-05-19T08:20:00Z"
  },
  {
    id: "chc-002",
    road_name: "Moorhouse Avenue",
    region: "Christchurch",
    latitude: -43.5321,
    longitude: 172.6362,
    camera_type: "Average",
    speed_limit: 60,
    status: "Active",
    enforcement_start: "2023-08-01T00:00:00Z",
    last_updated: "2024-05-20T16:00:00Z"
  },
  {
    id: "akl-003",
    road_name: "Fanshawe Street",
    region: "Auckland",
    latitude: -36.8485,
    longitude: 174.7633,
    camera_type: "Fixed",
    speed_limit: 50,
    status: "Active",
    enforcement_start: "2022-07-21T00:00:00Z",
    last_updated: "2024-05-21T11:00:00Z"
  },
  {
    id: "wgn-003",
    road_name: "Waterfront Drive",
    region: "Wellington",
    latitude: -41.291,
    longitude: 174.7824,
    camera_type: "Fixed",
    speed_limit: 50,
    status: "Active",
    enforcement_start: "2023-02-18T00:00:00Z",
    last_updated: "2024-05-20T12:15:00Z"
  },
  {
    id: "chc-003",
    road_name: "Blenheim Road",
    region: "Christchurch",
    latitude: -43.5513,
    longitude: 172.6289,
    camera_type: "Fixed",
    speed_limit: 60,
    status: "Inactive",
    enforcement_start: "2020-01-30T00:00:00Z",
    last_updated: "2024-02-10T18:00:00Z"
  },
  {
    id: "akl-004",
    road_name: "SH1 - Northern Motorway",
    region: "Auckland",
    latitude: -36.758,
    longitude: 174.702,
    camera_type: "Average",
    speed_limit: 100,
    status: "Active",
    enforcement_start: "2023-09-01T00:00:00Z",
    last_updated: "2024-05-21T14:30:00Z"
  }
];
