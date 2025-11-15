export type CameraType = "fixed" | "average";
export type CameraStatus = "active" | "inactive";

export interface SpeedCamera {
  id: string;
  type: CameraType;
  status: CameraStatus;
  location: {
    lat: number;
    lng: number;
  };
  road: string;
  region: string;
  speed_limit: number;
}
