// ====================
// SÉRIES TEMPORELLES ANIMÉES
// ====================

const TimeSeriesModule = () => {
  const [timelineData, setTimelineData] = useState([]);
  const [currentTimeIndex, setCurrentTimeIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [timeRange, setTimeRange] = useState({ start: null, end: null });

  // Exemple: données COVID-19 par département et par date
  const sampleTimeData = [
    {
      date: "2020-03-01",
      features: [
        { id: "dep-75", cases: 100, deaths: 5 },
        { id: "dep-13", cases: 80, deaths: 3 }
      ]
    },
    {
      date: "2020-03-02",
      features: [
        { id: "dep-75", cases: 150, deaths: 8 },
        { id: "dep-13", cases: 120, deaths: 6 }
      ]
    }
  ];

  // Animation temporelle
  const animateTimeSeries = () => {
    if (!isPlaying || currentTimeIndex >= timelineData.length - 1) {
      setIsPlaying(false);
      return;
    }

    const interval = setInterval(() => {
      setCurrentTimeIndex(prev => {
        if (prev >= timelineData.length - 1) {
          setIsPlaying(false);
          return prev;
        }
        return prev + 1;
      });
    }, 1000 / playbackSpeed);

    return () => clearInterval(interval);
  };

  useEffect(() => {
    if (isPlaying) {
      animateTimeSeries();
    }
  }, [isPlaying, playbackSpeed]);

  // Mettre à jour les styles des entités selon le temps
  const updateTimeStyles = (timeIndex) => {
    const timeData = timelineData[timeIndex];
    if (!timeData) return;

    mapLayers.forEach(layer => {
      const source = layer.layer.getSource();
      const features = source.getFeatures();
      
      features.forEach(feature => {
        const featureId = feature.getId();
        const timeFeature = timeData.features.find(f => f.id === featureId);
        
        if (timeFeature) {
          // Calculer une couleur basée sur les cas
          const intensity = Math.min(timeFeature.cases / 1000, 1);
          const color = `rgba(239, 68, 68, ${intensity})`;
          
          feature.setStyle(new Style({
            fill: new Fill({ color }),
            stroke: new Stroke({
              color: '#dc2626',
              width: 2
            })
          }));
        }
      });
    });
  };

  // Interface timeline
  const renderTimeline = () => (
    <div style={{
      position: "fixed",
      bottom: "80px",
      left: "50%",
      transform: "translateX(-50%)",
      width: "80%",
      background: "rgba(15, 23, 42, 0.95)",
      border: "1px solid #334155",
      borderRadius: "12px",
      padding: "15px",
      backdropFilter: "blur(10px)",
      zIndex: 900
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: "15px", marginBottom: "10px" }}>
        <button
          onClick={() => setIsPlaying(!isPlaying)}
          style={{
            width: "40px",
            height: "40px",
            background: isPlaying ? "#ef4444" : "#10b981",
            border: "none",
            borderRadius: "50%",
            color: "white",
            fontSize: "18px",
            cursor: "pointer"
          }}
        >
          {isPlaying ? "⏸️" : "▶️"}
        </button>
        
        <input
          type="range"
          min="0"
          max={timelineData.length - 1}
          value={currentTimeIndex}
          onChange={(e) => {
            setCurrentTimeIndex(parseInt(e.target.value));
            updateTimeStyles(parseInt(e.target.value));
          }}
          style={{ flex: 1 }}
        />
        
        <select
          value={playbackSpeed}
          onChange={(e) => setPlaybackSpeed(parseFloat(e.target.value))}
          style={{
            padding: "8px 12px",
            background: "#1e293b",
            color: "white",
            border: "1px solid #475569",
            borderRadius: "6px"
          }}
        >
          <option value="0.5">0.5x</option>
          <option value="1">1x</option>
          <option value="2">2x</option>
          <option value="5">5x</option>
        </select>
        
        <div style={{ fontSize: "14px", color: "#94a3b8" }}>
          {timelineData[currentTimeIndex]?.date || "Aucune donnée"}
        </div>
      </div>
      
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        fontSize: "12px",
        color: "#64748b"
      }}>
        {timelineData.slice(0, 10).map((item, idx) => (
          <div key={idx} style={{ textAlign: "center" }}>
            <div>{item.date.split('-')[2]}</div>
            <div style={{ fontSize: "10px" }}>
              {item.date.split('-')[1]}/{item.date.split('-')[0]}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};