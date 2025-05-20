import React, { useEffect, useRef } from 'react';
import mapImage from '../../../assets/pokeworld_map.png';

export default function PokeworldMap() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext('2d');
    if (!context) return;

    const image = new Image();
    image.src = mapImage;

    image.onload = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;

      context.drawImage(image, 0, 0, canvas.width, canvas.height);
    };

    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();

      const x = Math.floor(e.clientX - rect.left);
      const y = Math.floor(e.clientY - rect.top);

      const imageData = context.getImageData(x, y, 1, 1).data;
      const [r, g, b, a] = imageData;

      if(r === 251 && g === 251 && b === 251) {
        canvasRef.current.classList.add('cursor-pointer');
      } else {
        canvasRef.current.classList.remove('cursor-pointer');
      }
    };

    canvas.addEventListener('mousemove', handleMouseMove);

    return () => {
      canvas.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <div className="w-full h-[93vh] overflow-hidden">
      <canvas
        ref={canvasRef}
        className="w-full h-[93vh] block"
      />
    </div>
  );
}
