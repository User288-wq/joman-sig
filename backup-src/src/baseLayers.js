// src/layers/baseLayers.js
import TileLayer from "ol/layer/Tile";
import OSM from "ol/source/OSM";

export const osmLayer = new TileLayer({
  source: new OSM(),
  visible: true,
  title: "OpenStreetMap",
});