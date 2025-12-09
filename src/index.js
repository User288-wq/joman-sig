import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

// Import Leaflet CSS
import 'leaflet/dist/leaflet.css';

// Correction pour les marqueurs Leaflet
import L from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.divIcon({
  html: `
    <div style="
      background-image: url(${icon});
      background-size: cover;
      width: 25px;
      height: 41px;
      position: relative;
    ">
      <div style="
        background-image: url(${iconShadow});
        background-size: cover;
        width: 25px;
        height: 41px;
        position: absolute;
        top: 0;
        left: 0;
      "></div>
    </div>
  `,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();