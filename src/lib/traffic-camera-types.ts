// This represents the structure AFTER converting XML to JS object
// Note that all values are initially objects with a `_text` property.

interface XmlTextNode {
    _text: string;
}

export interface TrafficCamera {
  traffic?: {
    cameraList?: {
        camera: Camera | Camera[];
    }
  };
}

export interface Camera {
  id: XmlTextNode;
  lat: XmlTextNode;
  lon: XmlTextNode;
  name: XmlTextNode;
  region: XmlTextNode;
  subRegion: XmlTextNode;
  type: XmlTextNode;
  description: XmlTextNode;
  direction: XmlTextNode;
  view: XmlTextNode;
  width: XmlTextNode;
  height: XmlTextNode;
  status: XmlTextNode;
  speedLimit?: XmlTextNode;
}
