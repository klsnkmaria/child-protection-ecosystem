import { create } from 'zustand';

interface DashboardState {
  selectedChild: string | null;
  children: any[];
  setSelectedChild: (id: string) => void;
  setChildren: (children: any[]) => void;
}

export const useDashboardStore = create<DashboardState>((set) => ({
  selectedChild: null,
  children: [],
  setSelectedChild: (id) => set({ selectedChild: id }),
  setChildren: (children) => set({ children }),
}));
