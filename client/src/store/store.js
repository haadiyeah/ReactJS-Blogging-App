import { create } from 'zustand';

const useStore = create(set => ({
  token: '',
  setToken: (token) => set({ token }),
}));


export default useStore;