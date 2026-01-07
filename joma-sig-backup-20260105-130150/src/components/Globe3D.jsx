import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import './Globe3D.css';

const Globe3D = () => {
  const containerRef = useRef(null);
  const [scene, setScene] = useState(null);
  const [camera, setCamera] = useState(null);
  const [renderer, setRenderer] = useState(null);
  const [controls, setControls] = useState(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [globeRotation, setGlobeRotation] = useState(true);
  const [timeOfDay, setTimeOfDay] = useState(12); // Heure du jour (0-24)
  const [showCountries, setShowCountries] = useState(true);
  const [showClouds, setShowClouds] = useState(true);
  const [viewMode, setViewMode] = useState('globe'); // globe, flat, satellite

  // Initialiser la scÃƒÆ’Ã‚Â¨ne 3D
  useEffect(() => {
    if (!containerRef.current || isInitialized) return;

    // Scene
    const newScene = new THREE.Scene();
    newScene.background = new THREE.Color(0x000033);

    // Camera
    const newCamera = new THREE.PerspectiveCamera(
      75,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000
    );
    newCamera.position.z = 5;

    // Renderer
    const newRenderer = new THREE.WebGLRenderer({ antialias: true });
    newRenderer.setSize(
      containerRef.current.clientWidth,
      containerRef.current.clientHeight
    );
    containerRef.current.appendChild(newRenderer.domElement);

    // Controls
    const newControls = new OrbitControls(newCamera, newRenderer.domElement);
    newControls.enableDamping = true;
    newControls.dampingFactor = 0.25;
    newControls.rotateSpeed = 0.5;

    // LumiÃƒÆ’Ã‚Â¨re principale
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    newScene.add(ambientLight);

    // LumiÃƒÆ’Ã‚Â¨re directionnelle (soleil)
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 3, 5);
    newScene.add(directionalLight);

    // CrÃƒÆ’Ã‚Â©er le globe
    createGlobe(newScene, viewMode);

    setScene(newScene);
    setCamera(newCamera);
    setRenderer(newRenderer);
    setControls(newControls);
    setIsInitialized(true);

    // Animation
    const animate = () => {
      requestAnimationFrame(animate);
      
      if (globeRotation) {
        const globe = newScene.children.find(child => child.name === 'globe');
        if (globe) {
          globe.rotation.y += 0.001;
        }
      }

      newControls.update();
      newRenderer.render(newScene, newCamera);
    };

    animate();

    // Gestion du redimensionnement
    const handleResize = () => {
      if (!newCamera || !newRenderer || !containerRef.current) return;
      
      newCamera.aspect = containerRef.current.clientWidth / containerRef.current.clientHeight;
      newCamera.updateProjectionMatrix();
      newRenderer.setSize(
        containerRef.current.clientWidth,
        containerRef.current.clientHeight
      );
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (newRenderer && newRenderer.domElement.parentNode) {
        newRenderer.domElement.parentNode.removeChild(newRenderer.domElement);
      }
    };
  }, [isInitialized]);

  // CrÃƒÆ’Ã‚Â©er le globe
  const createGlobe = (scene, mode) => {
    // Supprimer l'ancien globe s'il existe
    const oldGlobe = scene.children.find(child => child.name === 'globe');
    if (oldGlobe) {
      scene.remove(oldGlobe);
    }

    // GÃƒÆ’Ã‚Â©omÃƒÆ’Ã‚Â©trie de la sphÃƒÆ’Ã‚Â¨re
    const geometry = new THREE.SphereGeometry(2, 64, 64);

    let material;
    if (mode === 'satellite') {
      // Texture satellite
      material = new THREE.MeshPhongMaterial({
        color: 0x2a5c8c,
        specular: 0x222222,
        shininess: 30,
        transparent: true,
        opacity: 0.9
      });
    } else {
      // Texture classique
      material = new THREE.MeshPhongMaterial({
        color: 0x1e90ff,
        specular: 0x222222,
        shininess: 50,
        transparent: true,
        opacity: 0.8
      });
    }

    const globe = new THREE.Mesh(geometry, material);
    globe.name = 'globe';

    // Ajouter les continents
    if (showCountries) {
      const countriesGeometry = new THREE.SphereGeometry(2.01, 64, 64);
      const countriesMaterial = new THREE.MeshBasicMaterial({
        color: 0x228b22,
        wireframe: true,
        transparent: true,
        opacity: 0.3
      });
      const countries = new THREE.Mesh(countriesGeometry, countriesMaterial);
      globe.add(countries);
    }

    // Ajouter les nuages
    if (showClouds) {
      const cloudsGeometry = new THREE.SphereGeometry(2.1, 32, 32);
      const cloudsMaterial = new THREE.MeshPhongMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.2
      });
      const clouds = new THREE.Mesh(cloudsGeometry, cloudsMaterial);
      clouds.name = 'clouds';
      globe.add(clouds);
    }

    // Ajouter l'atmosphÃƒÆ’Ã‚Â¨re
    const atmosphereGeometry = new THREE.SphereGeometry(2.15, 32, 32);
    const atmosphereMaterial = new THREE.ShaderMaterial({
      uniforms: {},
      vertexShader: `
        varying vec3 vNormal;
        void main() {
          vNormal = normalize(normalMatrix * normal);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        varying vec3 vNormal;
        void main() {
          float intensity = pow(0.8 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.0);
          gl_FragColor = vec4(0.3, 0.6, 1.0, 0.3) * intensity;
        }
      `,
      side: THREE.BackSide,
      transparent: true
    });
    const atmosphere = new THREE.Mesh(atmosphereGeometry, atmosphereMaterial);
    globe.add(atmosphere);

    scene.add(globe);
  };

  // Mettre ÃƒÆ’Ã‚Â  jour le globe quand les options changent
  useEffect(() => {
    if (scene) {
      createGlobe(scene, viewMode);
    }
  }, [showCountries, showClouds, viewMode]);

  // Mettre ÃƒÆ’Ã‚Â  jour l'ÃƒÆ’Ã‚Â©clairage selon l'heure
  useEffect(() => {
    if (scene && camera) {
      // Calculer la position du soleil basÃƒÆ’Ã‚Â©e sur l'heure
      const hourAngle = (timeOfDay / 24) * Math.PI * 2;
      const sunLight = scene.children.find(child => 
        child instanceof THREE.DirectionalLight
      );
      
      if (sunLight) {
        sunLight.position.set(
          Math.cos(hourAngle) * 5,
          Math.sin(hourAngle) * 3,
          Math.sin(hourAngle) * 5
        );
      }
    }
  }, [timeOfDay, scene]);

  const handleViewModeChange = (mode) => {
    setViewMode(mode);
  };

  const resetView = () => {
    if (camera && controls) {
      camera.position.set(0, 0, 5);
      controls.reset();
    }
  };

  const toggleRotation = () => {
    setGlobeRotation(!globeRotation);
  };

  return (
    <div className="globe-3d-container">
      <div className="globe-canvas" ref={containerRef} />
      
      <div className="globe-controls">
        <div className="control-group">
          <h4> ContrÃƒÆ’Ã‚Â´les du globe</h4>
          
          <div className="control-row">
            <label>
              <input
                type="checkbox"
                checked={globeRotation}
                onChange={toggleRotation}
              />
              Rotation automatique
            </label>
          </div>
          
          <div className="control-row">
            <label>
              <input
                type="checkbox"
                checked={showCountries}
                onChange={(e) => setShowCountries(e.target.checked)}
              />
              Afficher les pays
            </label>
          </div>
          
          <div className="control-row">
            <label>
              <input
                type="checkbox"
                checked={showClouds}
                onChange={(e) => setShowClouds(e.target.checked)}
              />
              Nuages
            </label>
          </div>
          
          <div className="control-row">
            <label>Heure du jour:</label>
            <input
              type="range"
              min="0"
              max="24"
              value={timeOfDay}
              onChange={(e) => setTimeOfDay(parseInt(e.target.value))}
              className="time-slider"
            />
            <span>{timeOfDay}h</span>
          </div>
        </div>
        
        <div className="view-mode-selector">
          <button
            className={`view-mode-btn ${viewMode === 'globe' ? 'active' : ''}`}
            onClick={() => handleViewModeChange('globe')}
          >
            Globe
          </button>
          <button
            className={`view-mode-btn ${viewMode === 'satellite' ? 'active' : ''}`}
            onClick={() => handleViewModeChange('satellite')}
          >
            Satellite
          </button>
          <button
            className={`view-mode-btn ${viewMode === 'flat' ? 'active' : ''}`}
            onClick={() => handleViewModeChange('flat')}
          >
            Plat
          </button>
        </div>
        
        <div className="action-buttons">
          <button onClick={resetView} className="action-btn">
             RÃƒÆ’Ã‚Â©initialiser
          </button>
          <button onClick={() => camera?.position.set(0, 5, 0)} className="action-btn">
             Vue satellite
          </button>
          <button onClick={() => camera?.position.set(5, 0, 0)} className="action-btn">
             Vue horizontale
          </button>
        </div>
      </div>
      
      <div className="globe-stats">
        <div className="stat-item">
          <span className="stat-label">Mode:</span>
          <span className="stat-value">{viewMode.toUpperCase()}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Rotation:</span>
          <span className="stat-value">{globeRotation ? 'ON' : 'OFF'}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Heure:</span>
          <span className="stat-value">{timeOfDay}h00</span>
        </div>
      </div>
      
      <div className="globe-instructions">
        <p><strong>Instructions:</strong></p>
        <ul>
          <li> Rotation: clic gauche + glisser</li>
          <li> Zoom: molette de la souris</li>
          <li> Panoramique: clic droit + glisser</li>
          <li> RÃƒÆ’Ã‚Â©initialiser: bouton " RÃƒÆ’Ã‚Â©initialiser"</li>
        </ul>
      </div>
    </div>
  );
};

export default Globe3D;
