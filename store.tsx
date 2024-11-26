import { create } from 'zustand';

const useStore = create<storeType>((set) => ({
    set: 1,
    setSet: (newSet: number) => set({ set: newSet }),
}));

type storeType = {
    set: number,
    setSet: (newSet: number) => void
}

export { useStore, storeType };