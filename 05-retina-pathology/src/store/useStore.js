import { create } from 'zustand';

export const useStore = create((set) => ({
  progression: 0,
  selectedLayer: 'pr',
  setProgression: (val) => set({ progression: val }),
  setSelectedLayer: (id) => set({ selectedLayer: id }),
  metrics: {
    drusenVolume: 0,
    rpeStress: 0,
    neovascularRisk: 0
  },
  updateMetrics: (p) => set({
    metrics: {
      drusenVolume: p > 50 ? (p - 50) * 1.5 : 0,
      rpeStress: Math.min(p * 1.2, 100),
      neovascularRisk: p > 75 ? (p - 75) * 4 : 0
    }
  })
}));
