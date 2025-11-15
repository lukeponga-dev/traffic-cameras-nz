export interface TrafficCamera {
  cameraList?: CameraList;
}

export interface CameraList {
  cameras: Camera[];
}

export interface Camera {
  id: string;
  lat: number;
  lon: number;
  name: string;
  region: string;
  subRegion: string;
  type: 'Fixed' | 'Mobile' | 'Red light';
  description: string;
  direction: string;
  view: string;
  width: number;
  height: number;
  status: 'Active' | 'Inactive';
  speedLimit?: number;
}
