// src/layers/vectorLayers.js
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import GeoJSON from "ol/format/GeoJSON";

export const roadsLayer = new VectorLayer({
  title: "Routes",
  visible: false,
  source: new VectorSource({
    url: "/data/roads.geojson",
    format: new GeoJSON(),
  }),
});

export const villagesLayer = new VectorLayer({
  title: "Villages",
  visible: false,
  source: new VectorSource({
    url: "/data/villages.geojson",
    format: new GeoJSON(),
  }),
});
