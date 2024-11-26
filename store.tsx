import { create } from 'zustand';
import exerciseInfoType from "@/types/exerciseInfoType";

const useStore = create<storeType>((set) => ({
    set: 1,
    setSet: (newSet: number) => set({ set: newSet }),

    nextExerciseHandler: () => {

    },
    prevExerciseHandler: () => {

    },

    exerciseInfo: {
        currentExercise: '',
        currentWeight: [],
        currentRest: 0,
        currentSets: 0,
        currentReps: [],
        nextExercise: '',
        nextWeight: 0,
        prevExercise: '',
        prevWeight: 0,
        scheme: '',
        exerciseNumber: 0,
    },
    setExerciseInfo: (newInfo: exerciseInfoType) => set({ exerciseInfo: newInfo }),
}));

type storeType = {
    set: number,
    setSet: (newSet: number) => void
    nextExerciseHandler: () => void,
    prevExerciseHandler: () => void,
    exerciseInfo: exerciseInfoType
}

export { useStore, storeType };