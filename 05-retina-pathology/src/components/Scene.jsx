import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows } from '@react-three/drei';
import { RetinaModel } from './RetinaModel';

export default function Scene() {
  return (
    <Canvas 
      shadows 
      camera={{ position: [14, 14, 14], fov: 22 }}
      style={{ width: '100vw', height: '100vh', position: 'absolute', top: 0, left: 0 }}
    >
      <color attach="background" args={['#fdfbf7']} />
      
      <OrbitControls 
        makeDefault 
        enablePan={true}
        autoRotate={false}
        minPolarAngle={0}
        maxPolarAngle={Math.PI / 2.1}
      />

      <ambientLight intensity={1.8} />
      <spotLight position={[20, 40, 20]} angle={0.2} penumbra={1} intensity={3} castShadow />
      <directionalLight position={[-15, 15, -5]} intensity={1.5} color="#ffffff" />
      <pointLight position={[0, 10, 0]} intensity={1} color="#fff9db" />

      <RetinaModel />
      
      <Environment preset="studio" />
      <ContactShadows 
        position={[0, -2.5, 0]} 
        opacity={0.12} 
        scale={25} 
        blur={4} 
        far={5} 
      />
    </Canvas>
  );
}
