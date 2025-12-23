export function createVectorLayer(id, name, features = []) {
  return { id, type: "vector", name, features };
}

export function createRasterLayer(id, name, source) {
  return { id, type: "raster", name, source };
}
