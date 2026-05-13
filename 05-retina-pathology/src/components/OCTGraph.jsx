import React from 'react';

export default function OCTGraph({ progression }) {
  // Simula um perfil de B-Scan baseado na deformação central
  const points = 50;
  const pathArr = Array.from({ length: points }, (_, i) => {
    const x = (i / points) * 200;
    const dist = Math.abs(i - points / 2);
    const bump = progression > 50 ? Math.max(0, 30 - dist * 2) * ((progression - 50) / 50) : 0;
    const noise = Math.sin(i * 0.5) * 2;
    return `${x},${50 - bump + noise}`;
  });

  const path = pathArr.join(' ');
  const pathRPE = pathArr.map(p => {
    const [x, y] = p.split(',');
    return `${x},${parseFloat(y) + 5}`;
  }).join(' ');

  return (
    <div className="w-64 h-32 bg-black/40 backdrop-blur-md border border-white/10 rounded-xl p-3">
      <div className="text-[10px] uppercase opacity-50 mb-2 flex justify-between">
        <span>B-Scan Simulado</span>
        <span className="text-blue-400">OCT_LIVE</span>
      </div>
      <svg viewBox="0 0 200 100" className="w-full h-20">
        <polyline points={path} fill="none" stroke="#60a5fa" strokeWidth="1" />
        <line x1="0" y1="50" x2="200" y2="50" stroke="white" strokeWidth="0.5" strokeDasharray="4" opacity="0.2" />
        {/* Camada RPE deformada */}
        <polyline points={pathRPE} fill="none" stroke="#d4af37" strokeWidth="1.5" opacity="0.8" />
      </svg>
    </div>
  );
}
