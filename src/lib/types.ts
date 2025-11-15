export type CameraType = 'Fixed' | 'Average' | 'Mobile' | 'Red light';
export type CameraStatus = 'Active' | 'Inactive' | 'Offline';

export interface SpeedCamera {
  id: string;
  name: string;
  region: string;
  latitude: number;
  longitude: number;
  cameraType: CameraType;
  speedLimit: number | null;
  status: CameraStatus;
  viewUrl: string;
  description: string;
  direction: string;
  imageUrl: string;
}
