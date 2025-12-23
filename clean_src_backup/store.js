import { create } from 'zustand';

const useStore = create((set) => ({
  viewState: {
    center: [2.3522, 48.8566],
    zoom: 10,
    rotation: 0,
    projection: "EPSG:3857"
  },
  layers: [
    { 
      id: "osm-base", 
      name: "Carte OSM", 
      type: "base", 
      visible: true,
      opacity: 1
    }
  ],
  setViewState: (viewState) => set({ viewState }),
  updateLayer: (id, updates) => set((state) => ({
    layers: state.layers.map(layer => 
      layer.id === id ? { ...layer, ...updates } : layer
    )
  }))
}));

export default useStore;
