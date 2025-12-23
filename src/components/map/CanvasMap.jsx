import React, { useRef, useEffect } from 'react';

const CanvasMap = ({ onMapLoad }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    
    // Fond
    ctx.fillStyle = '#f8f9fa';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Grille
    ctx.strokeStyle = '#dee2e6';
    ctx.lineWidth = 1;
    
    // Grille horizontale
    for (let i = 0; i <= canvas.height; i += 50) {
      ctx.beginPath();
      ctx.moveTo(0, i);
      ctx.lineTo(canvas.width, i);
      ctx.stroke();
    }
    
    // Grille verticale
    for (let i = 0; i <= canvas.width; i += 50) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, canvas.height);
      ctx.stroke();
    }

    if (onMapLoad) {
      onMapLoad({ type: 'canvas', element: canvas });
    }
  }, [onMapLoad]);

  return (
    <div style={{
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#f5f5f5'
    }}>
      <canvas
        ref={canvasRef}
        width={800}
        height={600}
        style={{
          border: '2px solid #ddd',
          borderRadius: '8px',
          backgroundColor: 'white'
        }}
      />
      <div style={{
        marginTop: '20px',
        color: '#666',
        textAlign: 'center'
      }}>
        <div style={{ fontSize: '18px', fontWeight: 'bold' }}>
          Mode Canvas - Dessin vectoriel
        </div>
      </div>
    </div>
  );
};

export default CanvasMap;
