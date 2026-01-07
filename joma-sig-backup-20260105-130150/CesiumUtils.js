// src/core/CesiumUtils.js
export function addGeoJsonLayer(viewer, geojson, name = "Layer") {
  return Cesium.GeoJsonDataSource.load(geojson, { clampToGround: true })
    .then((dataSource) => {
      viewer.dataSources.add(dataSource);
      dataSource.name = name;
      // Envoie info au panneau RÃƒÂ©sultats
      window.dispatchEvent(new CustomEvent("joman-result", {
        detail: { message: `${name} ajoutÃƒÂ© ÃƒÂ  la scÃƒÂ¨ne 3D` }
      }));
      return dataSource;
    });
}

// Mettre en surbrillance un entity
export function highlightEntity(entity) {
  entity.polygon.material = Cesium.Color.YELLOW.withAlpha(0.5);
  window.dispatchEvent(new CustomEvent("joman-result", {
    detail: { message: `EntitÃƒÂ© ${entity.name} surlignÃƒÂ©e` }
  }));
}
