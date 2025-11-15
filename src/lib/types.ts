export type CameraType = "Fixed" | "Average";
export type CameraStatus = "Active" | "Inactive";

export interface SpeedCamera {
  id: string;
  road_name: string;
  region: string;
  latitude: number;
  longitude: number;
  camera_type: CameraType;
  speed_limit: number;
  status: CameraStatus;
  enforcement_start: string;
  last_updated: string;
}
