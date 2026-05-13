import { useStore } from '../store/useStore';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Grid, BookOpen, Notebook, Settings, 
  RotateCcw, Maximize, EyeOff, Layout, Star
} from 'lucide-react';

const LAYER_DATA = {
  pr: { name: 'Photoreceptors', type: 'Eukaryotic Cell', icon: '🧬', detail: 'Nucleus', detailDesc: 'Biogenetic Core', research: 'The high metabolic rate of these cells requires constant recycling of photopigments.' },
  rpe: { name: 'RPE Layer', type: 'Supportive Tissue', icon: '🕸️', detail: 'Melanosome', detailDesc: 'Light Absorber', research: 'The Retinal Pigment Epithelium is crucial for maintaining the blood-retinal barrier.' },
  bruch: { name: "Bruch's Membrane", type: 'Barrier Tissue', icon: '🛡️', detail: 'Elastic Layer', detailDesc: 'Nutrient Filter', research: 'Aging of this membrane is a primary factor in the development of AMD.' },
  choroid: { name: 'Choroid', type: 'Vascular Bed', icon: '🩸', detail: 'Capillary', detailDesc: 'Oxygen Source', research: 'The choroid provides the highest blood flow per gram of tissue in the body.' }
};

export default function UIOverlay() {
  const { progression, setProgression, selectedLayer, setSelectedLayer } = useStore();
  const current = LAYER_DATA[selectedLayer];

  return (
    <div className="absolute inset-0 pointer-events-none flex flex-col p-8 overflow-hidden select-none z-10">
      <header className="flex justify-between items-center mb-8 pointer-events-auto">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-purple-100 rounded-2xl flex items-center justify-center shadow-sm">
            <Layout className="text-purple-600" size={24} />
          </div>
          <div>
            <h1 className="text-3xl serif text-stone-800">Retina Architecture Studio</h1>
            <p className="text-[10px] text-stone-400 uppercase tracking-[0.3em] font-bold">Explore life at the microscopic level ✦</p>
          </div>
        </div>
        <div className="flex items-center gap-10 text-stone-400">
          <NavIcon icon={<Grid size={20}/>} label="Gallery" />
          <NavIcon icon={<BookOpen size={20}/>} label="Library" />
          <NavIcon icon={<Notebook size={20}/>} label="Notebooks" />
          <NavIcon icon={<Settings size={20}/>} label="Settings" />
          <div className="w-11 h-11 bg-stone-200 rounded-full border-2 border-white shadow-md overflow-hidden">
             <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="avatar" />
          </div>
        </div>
      </header>

      <div className="flex-1 flex gap-8 min-h-0">
        <aside className="w-80 flex flex-col gap-6 pointer-events-auto custom-scrollbar overflow-y-auto">
          <section className="studio-card p-6">
            <h2 className="text-[11px] font-bold text-stone-400 uppercase tracking-widest mb-5">Retina Layers</h2>
            <div className="space-y-4">
              {Object.entries(LAYER_DATA).map(([id, data]) => (
                <LayerItem 
                  key={id} 
                  active={selectedLayer === id} 
                  name={data.name} 
                  type={data.type} 
                  icon={data.icon} 
                  onClick={() => setSelectedLayer(id)}
                />
              ))}
            </div>
          </section>

          <section className="studio-card p-6">
            <h2 className="text-[11px] font-bold text-stone-400 uppercase tracking-widest mb-4">Pathology State</h2>
            <div className="bg-stone-50 p-5 rounded-2xl border border-stone-100">
              <input 
                type="range" min="0" max="100" value={progression} 
                onChange={(e) => setProgression(parseInt(e.target.value))}
                className="w-full h-1 bg-stone-200 rounded-full appearance-none cursor-pointer accent-purple-600"
              />
              <div className="flex justify-between mt-3 text-[10px] font-bold text-stone-400 uppercase tracking-tighter">
                <span>Healthy State</span>
                <span>Pathological</span>
              </div>
            </div>
          </section>
        </aside>

        <main className="flex-1 relative flex flex-col justify-between">
          <div className="p-4">
            <AnimatePresence mode="wait">
              <motion.div key={selectedLayer} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                <h1 className="text-7xl serif text-stone-800 tracking-tighter">{current.name}</h1>
                <p className="text-2xl text-stone-400 italic serif mt-2">{current.type}</p>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="flex gap-6 pointer-events-auto items-end mb-4">
            <div className="studio-card p-5 flex-1 bg-white/70 backdrop-blur-xl border-stone-100 shadow-xl">
              <h3 className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                Live OCT Scan (B-Scan)
              </h3>
              <div className="h-28 bg-stone-950 rounded-2xl overflow-hidden relative shadow-inner flex items-center justify-center">
                 <OCTSVG progression={progression} />
              </div>
            </div>
            
            <div className="studio-card p-5 w-56 bg-white/70 backdrop-blur-xl border-stone-100 shadow-xl">
               <h3 className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-4">Biomarkers</h3>
               <div className="space-y-4">
                  <StatBar label="Tissue Health" value={100 - progression} color="bg-green-400" />
                  <StatBar label="Oxidative Stress" value={progression} color="bg-amber-400" />
               </div>
            </div>
          </div>
        </main>

        <aside className="w-80 flex flex-col gap-6 pointer-events-auto overflow-y-auto custom-scrollbar">
          <AnimatePresence mode="wait">
            <motion.section 
              key={selectedLayer + 'detail'}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="studio-card p-8 border-t-[6px] border-t-purple-500 shadow-xl"
            >
              <div className="flex justify-between items-start mb-8">
                <h2 className="text-[11px] font-bold text-stone-400 uppercase tracking-widest">Detail View</h2>
                <Star size={18} className="text-stone-300" />
              </div>
              <div className="flex gap-5 items-center mb-8">
                <div className="w-16 h-16 bg-purple-50 rounded-3xl flex items-center justify-center text-3xl shadow-inner">
                  {current.icon}
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-stone-800">{current.detail}</h3>
                  <p className="text-xs text-stone-400 italic serif">{current.detailDesc}</p>
                </div>
              </div>
              <div className="space-y-4">
                <DetailRow label="Status" value={progression > 50 ? "Compromised" : "Stable"} />
                <DetailRow label="Cell Visibility" value="100%" />
                <DetailRow label="Morphology" value="Typical" />
              </div>
            </motion.section>
          </AnimatePresence>

          <section className="studio-card p-8 border-t-[6px] border-t-blue-400 flex-1">
            <h2 className="text-[11px] font-bold text-stone-400 uppercase tracking-widest mb-5">Research Notes</h2>
            <AnimatePresence mode="wait">
              <motion.p 
                key={selectedLayer + 'notes'}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-[15px] leading-relaxed text-stone-600 serif italic"
              >
                "{current.research}"
              </motion.p>
            </AnimatePresence>
          </section>
        </aside>
      </div>
    </div>
  );
}

function OCTSVG({ progression }) {
  const points = 50;
  const pathArr = Array.from({ length: points }, (_, i) => {
    const x = (i / points) * 350;
    const dist = Math.abs(i - points / 2);
    const bump = progression > 35 ? Math.max(0, 30 - dist * 1.8) * ((progression - 35) / 65) : 0;
    const noise = Math.sin(i * 0.8) * 1.5;
    return `${x},${50 - bump + noise}`;
  });

  const path = pathArr.join(' ');
  const rpePath = pathArr.map(p => {
    const [x, y] = p.split(',');
    return `${x},${parseFloat(y) + 6}`;
  }).join(' ');

  return (
    <svg viewBox="0 0 350 100" className="w-full h-full opacity-60 px-4">
      <polyline points={path} fill="none" stroke="#60a5fa" strokeWidth="2.5" />
      <polyline points={rpePath} fill="none" stroke="#fbbf24" strokeWidth="1.5" opacity="0.8" />
      <line x1="0" y1="50" x2="350" y2="50" stroke="white" strokeWidth="0.5" strokeDasharray="4" opacity="0.1" />
    </svg>
  );
}

function StatBar({ label, value, color }) {
  return (
    <div>
      <div className="flex justify-between text-[10px] font-bold uppercase mb-1.5 text-stone-500 tracking-tight">
        <span>{label}</span>
        <span className="font-mono">{value}%</span>
      </div>
      <div className="w-full h-1.5 bg-stone-100 rounded-full overflow-hidden shadow-inner">
        <motion.div 
          className={`h-full ${color} shadow-[0_0_10px_rgba(0,0,0,0.1)]`} 
          animate={{ width: `${value}%` }}
          transition={{ type: "spring", stiffness: 60, damping: 20 }}
        />
      </div>
    </div>
  );
}

function NavIcon({ icon, label }) {
  return (
    <div className="flex flex-col items-center gap-1.5 cursor-pointer hover:text-purple-600 transition-all hover:scale-110">
      <div className="p-2 rounded-xl hover:bg-white hover:shadow-sm transition-all">{icon}</div>
      <span className="text-[10px] font-bold uppercase tracking-wider">{label}</span>
    </div>
  );
}

function LayerItem({ name, type, icon, active, onClick }) {
  return (
    <div 
      onClick={onClick}
      className={`p-5 rounded-3xl flex items-center gap-5 transition-all cursor-pointer border ${active ? 'bg-green-50 border-green-200 shadow-sm' : 'bg-white border-transparent hover:border-stone-100 hover:bg-stone-50'}`}
    >
      <div className="text-3xl">{icon}</div>
      <div className="flex-1">
        <h4 className="text-[15px] font-bold text-stone-800 leading-none mb-1">{name}</h4>
        <p className="text-[11px] text-stone-400 font-medium">{type}</p>
      </div>
      {active && <div className="w-2 h-2 bg-green-500 rounded-full shadow-[0_0_10px_rgba(34,197,94,0.5)]" />}
    </div>
  );
}

function CanvasAction({ icon, label }) {
  return (
    <button className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl hover:bg-stone-100 transition-all text-stone-600 font-bold group">
      <span className="group-hover:scale-110 transition-transform">{icon}</span>
      <span className="text-[11px] uppercase tracking-wide">{label}</span>
    </button>
  );
}

function DetailRow({ label, value }) {
  return (
    <div className="flex justify-between py-3 border-b border-stone-50 text-[13px]">
      <span className="text-stone-400 font-medium">{label}</span>
      <span className="font-bold text-stone-700">{value}</span>
    </div>
  );
}
