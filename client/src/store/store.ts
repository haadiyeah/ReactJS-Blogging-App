import { create } from 'zustand';

interface StoreState {
  token: string;
  setToken: (token: string) => void;
}

const useStore = create<StoreState>(set => ({
  token: '',
  setToken: (token: string) => set({ token }),
}));

export default useStore;