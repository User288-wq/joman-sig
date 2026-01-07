// src/components/ui/WidgetManager.jsx
import React from 'react';
import MeasureTools from '../tools/MeasureTools';
import GeoJSONImporter from '../import/GeoJSONImporter';
import AttributeTable from '../import/AttributeTable';

const WidgetManager = ({ activeWidget }) => {
  const widgets = {
    measure: { component: MeasureTools, style: { top: "60px" } },
    import: { component: GeoJSONImporter, style: { top: "80px", width: "300px" } },
    table: { component: AttributeTable, style: { top: "80px", width: "400px", height: "500px" } },
  };
  
  const config = widgets[activeWidget];
  if (!config) return null;
  
  const WidgetComponent = config.component;
  
  return (
    <div style={{ 
      position: "absolute", 
      right: "20px", 
      zIndex: 1000, 
      ...config.style 
    }}>
      <WidgetComponent />
    </div>
  );
};

export default WidgetManager;
