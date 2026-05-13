import Scene from './components/Scene';
import UIOverlay from './components/UIOverlay';

function App() {
  return (
    <div className="relative w-full h-screen bg-[#050505] overflow-hidden">
      <Scene />
      <UIOverlay />
      
      {/* Decorative Vignette */}
      <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_150px_rgba(0,0,0,0.8)]" />
    </div>
  );
}

export default App;
