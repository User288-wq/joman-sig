// ====================
// GÉOCODEUR MULTI-SOURCES
// ====================

const GeocoderModule = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [geocoderProviders, setGeocoderProviders] = useState([
    { id: "nominatim", name: "Nominatim (OSM)", enabled: true },
    { id: "photon", name: "Photon", enabled: true },
    { id: "google", name: "Google", enabled: false },
    { id: "ban", name: "BAN France", enabled: true }
  ]);

  // Recherche géocodage
  const performGeocodeSearch = async (query) => {
    if (!query.trim()) return;
    
    setIsSearching(true);
    try {
      const allResults = [];
      
      // Nominatim (OpenStreetMap)
      if (geocoderProviders.find(p => p.id === "nominatim" && p.enabled)) {
        const nominatimResults = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5`
        ).then(r => r.json());
        
        allResults.push(...nominatimResults.map(r => ({
          provider: "OpenStreetMap",
          name: r.display_name,
          coordinates: [parseFloat(r.lon), parseFloat(r.lat)],
          type: r.type,
          importance: r.importance
        })));
      }
      
      // Base Adresse Nationale (France)
      if (geocoderProviders.find(p => p.id === "ban" && p.enabled)) {
        const banResults = await fetch(
          `https://api-adresse.data.gouv.fr/search/?q=${encodeURIComponent(query)}&limit=5`
        ).then(r => r.json());
        
        allResults.push(...banResults.features.map(f => ({
          provider: "BAN France",
          name: f.properties.label,
          coordinates: f.geometry.coordinates,
          type: f.properties.type,
          score: f.properties.score
        })));
      }
      
      // Trier par pertinence
      const sortedResults = allResults.sort((a, b) => 
        (b.importance || b.score || 0) - (a.importance || a.score || 0)
      );
      
      setSearchResults(sortedResults);
      
    } catch (error) {
      console.error("Erreur géocodage:", error);
    } finally {
      setIsSearching(false);
    }
  };

  // Zoom sur un résultat
  const zoomToResult = (result) => {
    if (map && result.coordinates) {
      const coords = fromLonLat(result.coordinates);
      map.getView().animate({
        center: coords,
        zoom: 15,
        duration: 1000
      });
      
      // Ajouter un marqueur
      const marker = new Feature({
        geometry: new Point(coords)
      });
      
      marker.setStyle(new Style({
        image: new CircleStyle({
          radius: 10,
          fill: new Fill({ color: "#3b82f6" }),
          stroke: new Stroke({
            color: "#FFF",
            width: 3
          })
        })
      }));
      
      const markerSource = new VectorSource({ features: [marker] });
      const markerLayer = new VectorLayer({
        source: markerSource,
        name: `📍 ${result.name.substring(0, 30)}...`
      });
      
      map.addLayer(markerLayer);
      
      // Retirer après 10 secondes
      setTimeout(() => {
        map.removeLayer(markerLayer);
      }, 10000);
    }
  };

  // Interface géocodage
  const renderGeocoder = () => (
    <div style={{
      position: "fixed",
      top: "120px",
      left: "50%",
      transform: "translateX(-50%)",
      width: "500px",
      background: "rgba(15, 23, 42, 0.95)",
      border: "2px solid #3b82f6",
      borderRadius: "12px",
      backdropFilter: "blur(10px)",
      zIndex: 1000,
      boxShadow: "0 10px 25px rgba(0, 0, 0, 0.3)"
    }}>
      <div style={{ padding: "15px", display: "flex", gap: "10px" }}>
        <div style={{ position: "relative", flex: 1 }}>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && performGeocodeSearch(searchQuery)}
            placeholder="Rechercher une adresse, lieu, ville..."
            style={{
              width: "100%",
              padding: "12px 45px 12px 15px",
              background: "#1e293b",
              border: "1px solid #475569",
              borderRadius: "8px",
              color: "white",
              fontSize: "14px"
            }}
          />
          {isSearching ? (
            <div style={{
              position: "absolute",
              right: "15px",
              top: "50%",
              transform: "translateY(-50%)",
              animation: "spin 1s linear infinite"
            }}>
              ⏳
            </div>
          ) : (
            <button
              onClick={() => performGeocodeSearch(searchQuery)}
              style={{
                position: "absolute",
                right: "10px",
                top: "50%",
                transform: "translateY(-50%)",
                background: "none",
                border: "none",
                color: "#94a3b8",
                cursor: "pointer",
                fontSize: "18px"
              }}
            >
              🔍
            </button>
          )}
        </div>
        
        <button
          onClick={() => setGeocoderProviders(prev => 
            prev.map(p => ({ ...p, enabled: !p.enabled }))
          )}
          style={{
            padding: "10px 15px",
            background: "#1e293b",
            border: "1px solid #475569",
            borderRadius: "8px",
            color: "white",
            cursor: "pointer"
          }}
          title="Configurer les sources"
        >
          ⚙️
        </button>
      </div>
      
      {searchResults.length > 0 && (
        <div style={{
          maxHeight: "300px",
          overflowY: "auto",
          borderTop: "1px solid #334155"
        }}>
          {searchResults.map((result, idx) => (
            <div
              key={idx}
              onClick={() => zoomToResult(result)}
              style={{
                padding: "12px 15px",
                borderBottom: "1px solid #334155",
                cursor: "pointer",
                transition: "background 0.2s",
                background: idx % 2 === 0 ? "rgba(30, 41, 59, 0.5)" : "transparent"
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = "#2d3748"}
              onMouseLeave={(e) => e.currentTarget.style.background = idx % 2 === 0 
                ? "rgba(30, 41, 59, 0.5)" 
                : "transparent"
              }
            >
              <div style={{ 
                display: "flex", 
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "5px"
              }}>
                <strong style={{ color: "#e2e8f0" }}>
                  {result.name.length > 60 
                    ? result.name.substring(0, 60) + "..." 
                    : result.name}
                </strong>
                <span style={{
                  fontSize: "11px",
                  padding: "2px 8px",
                  background: "#0f172a",
                  borderRadius: "10px",
                  color: "#94a3b8"
                }}>
                  {result.provider}
                </span>
              </div>
              <div style={{ 
                fontSize: "12px", 
                color: "#94a3b8",
                display: "flex",
                gap: "15px"
              }}>
                <span>📌 {result.coordinates[0].toFixed(4)}, {result.coordinates[1].toFixed(4)}</span>
                <span>🏷️ {result.type}</span>
                {result.importance && (
                  <span>⭐ {(result.importance * 100).toFixed(0)}%</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};