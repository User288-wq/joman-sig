// PrintComposer.jsx - Mise en page pour impression
const PrintComposer = ({ map, layers }) => {
  const [layout, setLayout] = useState({
    title: 'Carte générée avec JOMA SIG',
    scale: '1:50,000',
    legend: true,
    northArrow: true,
    scaleBar: true,
    grid: false,
    pageSize: 'A4',
    orientation: 'portrait',
    margins: { top: 20, right: 20, bottom: 20, left: 20 },
    mapExtent: null,
    elements: []
  });

  const addElement = (type, position) => {
    const newElement = {
      id: Date.now(),
      type: type,
      position: position,
      content: getDefaultContent(type),
      style: getDefaultStyle(type)
    };
    
    setLayout(prev => ({
      ...prev,
      elements: [...prev.elements, newElement]
    }));
  };

  const PageSizes = {
    'A4': { width: 210, height: 297 },
    'A3': { width: 297, height: 420 },
    'Letter': { width: 216, height: 279 }
  };

  const exportToPDF = () => {
    // Utiliser jsPDF et html2canvas
    const element = document.getElementById('print-preview');
    html2canvas(element).then(canvas => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: layout.orientation,
        unit: 'mm',
        format: layout.pageSize.toLowerCase()
      });
      
      pdf.addImage(imgData, 'PNG', 0, 0, 
        PageSizes[layout.pageSize].width,
        PageSizes[layout.pageSize].height
      );
      pdf.save(`carte-${new Date().toISOString().split('T')[0]}.pdf`);
    });
  };

  return (
    <div className="print-composer">
      <div className="composer-header">
        <h3>🖨️ Compositeur d'impression</h3>
        <div className="composer-actions">
          <button onClick={exportToPDF} className="btn-primary">
            📄 Exporter PDF
          </button>
          <button className="btn-secondary">
            🖼️ Exporter Image
          </button>
        </div>
      </div>
      
      <div className="composer-main">
        {/* Barre d'outils */}
        <div className="composer-toolbar">
          <div className="tool-group">
            <h4>Éléments</h4>
            <button onClick={() => addElement('title', { x: 50, y: 20 })}>
              🏷️ Titre
            </button>
            <button onClick={() => addElement('legend', { x: 180, y: 50 })}>
              📊 Légende
            </button>
            <button onClick={() => addElement('northArrow', { x: 190, y: 30 })}>
              🧭 Nord
            </button>
            <button onClick={() => addElement('scaleBar', { x: 50, y: 250 })}>
              📏 Échelle
            </button>
            <button onClick={() => addElement('text', { x: 100, y: 100 })}>
              📝 Texte
            </button>
            <button onClick={() => addElement('image', { x: 150, y: 150 })}>
              🖼️ Image
            </button>
          </div>
          
          <div className="tool-group">
            <h4>Mise en page</h4>
            <select 
              value={layout.pageSize}
              onChange={(e) => setLayout({...layout, pageSize: e.target.value})}
            >
              <option value="A4">A4 (210×297mm)</option>
              <option value="A3">A3 (297×420mm)</option>
              <option value="Letter">Letter (216×279mm)</option>
            </select>
            
            <select 
              value={layout.orientation}
              onChange={(e) => setLayout({...layout, orientation: e.target.value})}
            >
              <option value="portrait">Portrait</option>
              <option value="landscape">Paysage</option>
            </select>
          </div>
        </div>
        
        {/* Zone d'édition */}
        <div className="composer-canvas">
          <div 
            id="print-preview"
            className="page-preview"
            style={{
              width: `${PageSizes[layout.pageSize].width}mm`,
              height: `${PageSizes[layout.pageSize].height}mm`,
              backgroundColor: 'white'
            }}
          >
            {/* Carte */}
            <div className="map-container" style={{
              position: 'absolute',
              top: `${layout.margins.top}mm`,
              left: `${layout.margins.left}mm`,
              width: `calc(100% - ${layout.margins.left + layout.margins.right}mm)`,
              height: `calc(100% - ${layout.margins.top + layout.margins.bottom}mm)`,
              border: '1px solid #ccc'
            }}>
              {/* Capture de la carte */}
            </div>
            
            {/* Éléments ajoutés */}
            {layout.elements.map(element => (
              <div 
                key={element.id}
                className={`composer-element ${element.type}`}
                style={{
                  position: 'absolute',
                  left: `${element.position.x}mm`,
                  top: `${element.position.y}mm`,
                  ...element.style
                }}
                draggable
                onDragEnd={(e) => updateElementPosition(element.id, e)}
              >
                {renderElementContent(element)}
              </div>
            ))}
          </div>
        </div>
        
        {/* Propriétés */}
        <div className="composer-properties">
          <h4>Propriétés</h4>
          {layout.elements.length > 0 && (
            <ElementProperties 
              element={layout.elements[0]}
              onChange={(updates) => updateElement(layout.elements[0].id, updates)}
            />
          )}
        </div>
      </div>
    </div>
  );
};