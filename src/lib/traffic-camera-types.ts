// This represents the structure AFTER converting XML to JS object
// Note that all values are initially objects with a `_text` property.

interface XmlTextNode {
    _text: string;
}

export interface TrafficCamera {
  response?: {
    camera: Camera | Camera[];
  };
}

export interface Camera {
  id: XmlTextNode;
  latitude: XmlTextNode;
  longitude: XmlTextNode;
  name: XmlTextNode;
  region: { name: XmlTextNode };
  type: XmlTextNode;
  description: XmlTextNode;
  direction: XmlTextNode;
  imageUrl: XmlTextNode;
  status: XmlTextNode;
  offline?: XmlTextNode;
  speedLimit?: XmlTextNode;
}
