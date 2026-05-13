import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Instance, Instances } from '@react-three/drei';
import * as THREE from 'three';
import { useStore } from '../store/useStore';

export function RetinaModel() {
  const { progression, selectedLayer } = useStore();
  const rpeRef = useRef();
  
  const getDisplacement = (x, z, p) => {
    if (p < 30) return 0;
    const intensity = (p - 30) / 70;
    return (Math.sin(x * 0.7) + Math.cos(z * 0.7)) * intensity * 1.5;
  };

  useFrame(() => {
    if (rpeRef.current) {
      const pos = rpeRef.current.geometry.attributes.position;
      for (let i = 0; i < pos.count; i++) {
        const x = pos.getX(i);
        const z = pos.getZ(i);
        pos.setY(i, getDisplacement(x, z, progression));
      }
      pos.needsUpdate = true;
    }
  });

  // Lógica de Opacidade Baseada na Seleção
  const getOpacity = (id) => (selectedLayer === id ? 1 : 0.15);

  return (
    <group rotation={[0, -Math.PI / 6, 0]}>
      {/* CHOROID */}
      <mesh position={[0, -2, 0]} receiveShadow>
        <boxGeometry args={[12, 1.4, 12]} />
        <meshStandardMaterial 
          color="#ffa8a8" 
          transparent 
          opacity={getOpacity('choroid')} 
          roughness={0.7} 
        />
      </mesh>

      {/* RPE */}
      <mesh ref={rpeRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.2, 0]} receiveShadow castShadow>
        <planeGeometry args={[11.5, 11.5, 40, 40]} />
        <meshStandardMaterial 
          color="#ffd166" 
          transparent 
          opacity={getOpacity('rpe')} 
          roughness={0.5} 
          flatShading 
        />
      </mesh>

      {/* PHOTORECEPTORS */}
      <Instances range={200}>
        <cylinderGeometry args={[0.08, 0.08, 1.5, 8]} />
        <meshStandardMaterial 
          color="#83c5be" 
          transparent 
          opacity={getOpacity('pr')} 
          roughness={0.4} 
        />
        {Array.from({ length: 14 }).map((_, x) => 
          Array.from({ length: 14 }).map((_, z) => (
            <PRInstance 
              key={`${x}-${z}`} 
              x={(x - 7) * 0.7} 
              z={(z - 7) * 0.7} 
              getDisplacement={getDisplacement} 
            />
          ))
        )}
      </Instances>

      {/* NEOVASOS */}
      {progression > 60 && (
        <mesh position={[0, -0.6, 0]} castShadow>
          <torusKnotGeometry args={[3.5, 0.05, 160, 24]} />
          <meshStandardMaterial color="#ef476f" transparent opacity={getOpacity('choroid')} />
        </mesh>
      )}
    </group>
  );
}

function PRInstance({ x, z, getDisplacement }) {
  const ref = useRef();
  const progression = useStore((state) => state.progression);
  useFrame(() => {
    const disp = getDisplacement(x, z, progression);
    ref.current.position.set(x, disp + 0.3, z);
    const scale = progression > 80 ? Math.max(0.15, 1 - (progression - 80) / 20) : 1;
    ref.current.scale.set(1.2, scale, 1.2);
  });
  return <Instance ref={ref} />;
}
