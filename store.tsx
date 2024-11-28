import { create } from 'zustand';
import {accessoryExerciseType, superSetType, primaryExerciseType, programType} from "@/types/programType";

const useStore = create<storeType>((set) => ({
    set: 1,
    setSet: (newSet: number) => set({ set: newSet }),
    currentExercise: 0,
    setCurrentExercise: (newExercise: number) => set({ currentExercise: newExercise }),
    currentDay: 0,
    setCurrentDay: (newDay: number) => set({ currentDay: newDay }),
    currentScheme: '5 x 5',
    setCurrentScheme: (newScheme: string) => set({ currentScheme: newScheme }),

    nextExerciseHandler: () => {
        const currentExercise = useStore.getState().currentExercise;
        const nextExercise = useStore.getState().nextExercise();
        const setCurrentExercise = useStore.getState().setCurrentExercise;

        if (nextExercise === null) return;

        setCurrentExercise(currentExercise + 1);
    },

    prevExerciseHandler: () => {
        const currentExercise = useStore.getState().currentExercise;
        const prevExercise = useStore.getState().prevExercise();
        const setCurrentExercise = useStore.getState().setCurrentExercise;

        if (prevExercise === null) return;

        setCurrentExercise(currentExercise - 1);
    },

    program: null,
    setProgram: (newProgram) => {set({ program: newProgram });},

    isPrimaryExercise : (exercise: primaryExerciseType | accessoryExerciseType | superSetType): exercise is primaryExerciseType => {
        return (exercise as primaryExerciseType).weight_1 !== undefined;
    },

    isAccessoryExercise : (exercise: primaryExerciseType | accessoryExerciseType | superSetType): exercise is accessoryExerciseType => {
        return (exercise as accessoryExerciseType).weight !== undefined;
    },

    isSuperSet : (exercise: primaryExerciseType | accessoryExerciseType | superSetType): exercise is superSetType => {
        return (exercise as superSetType).exercise1 !== undefined;
    },

    exercise: () => useStore.getState().program!.days[useStore.getState().currentDay].exercises[useStore.getState().currentExercise],
    prevExercise: () => (useStore.getState().currentExercise > 0) ?
        useStore.getState().program!.days[useStore.getState().currentDay].exercises[useStore.getState().currentExercise - 1]
        : null,
    nextExercise: () => (useStore.getState().currentExercise < useStore.getState().program!.days[useStore.getState().currentDay].exercises.length-1) ?
        useStore.getState().program!.days[useStore.getState().currentDay].exercises[useStore.getState().currentExercise + 1]
        : null,

}));

type storeType = {
    set: number,
    setSet: (newSet: number) => void,
    currentExercise: number,
    setCurrentExercise: (newExercise: number) => void,
    currentDay: number,
    setCurrentDay: (newDay: number) => void,
    currentScheme: string,
    setCurrentScheme: (newScheme: string) => void,
    nextExerciseHandler: () => void,
    prevExerciseHandler: () => void,
    program: programType | null,
    setProgram: (newProgram: programType | null) => void,
    isPrimaryExercise: (exercise: primaryExerciseType | accessoryExerciseType | superSetType) => exercise is primaryExerciseType,
    isAccessoryExercise: (exercise: primaryExerciseType | accessoryExerciseType | superSetType) => exercise is accessoryExerciseType,
    isSuperSet: (exercise: primaryExerciseType | accessoryExerciseType | superSetType) => exercise is superSetType,
    exercise: () => primaryExerciseType | accessoryExerciseType | superSetType,
    prevExercise: () => primaryExerciseType | accessoryExerciseType | superSetType | null,
    nextExercise: () => primaryExerciseType | accessoryExerciseType | superSetType | null,
}

const useProgramStore = create<programStoreType>((set) => ({
    program: null,
    setProgram: (newProgram) => {set({ program: newProgram });},
}));

type programStoreType = {

}

export { useStore, storeType };