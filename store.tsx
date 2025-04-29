import { create } from 'zustand';
import {accessoryExerciseType, superSetType, primaryExerciseType, programType} from "@/types/programType";
import * as SQLite from "expo-sqlite";
import AsyncStorage from "@react-native-async-storage/async-storage";

const useStore = create<storeType>((set) => ({
    set: 1,
    setSet: (newSet: number) => {
        AsyncStorage.setItem('set', newSet.toString());
        set({set: newSet});
    },
    currentExercise: 0,
    setCurrentExercise: (newExercise: number) => {
        AsyncStorage.setItem('currentExercise', newExercise.toString());
        set({currentExercise: newExercise})
    },
    currentDay: 0,
    setCurrentDay: (newDay: number) => {
        AsyncStorage.setItem('currentDay', newDay.toString());
        AsyncStorage.setItem('currentExercise', '0');
        set({currentDay: newDay});
        set({currentExercise: 0});
    },
    currentScheme: '5 x 5',
    setCurrentScheme: (newScheme: string) => {
        AsyncStorage.setItem('currentScheme', newScheme);
        set({currentScheme: newScheme});
    },
    timesReset: 0,
    setTimesReset: (newTimesReset: number) => set({ timesReset: newTimesReset }),
    reset: () => {
        set({ set: 1 });
        set({ currentExercise: 0 });
        set({ currentDay: 0 });
        set({ currentScheme: '5 x 5' });
        set({ timesReset: useStore.getState().timesReset + 1 });
    },
    time: 0,
    setTime: (newTime: number) => {
        set({time: newTime});
        AsyncStorage.setItem('timer', newTime.toString());
    },
    paused: true,
    setPaused: (newPaused: boolean) => {
        set({paused: newPaused});
        AsyncStorage.setItem('paused', newPaused.toString());
        if (newPaused) {
            AsyncStorage.removeItem('initialTime');
            AsyncStorage.removeItem('startTime');
        }
        else {
            AsyncStorage.setItem('initialTime', new Date().getTime().toString());
            AsyncStorage.setItem('startTime', useStore.getState().time.toString());
        }
    },
    retrievedTime : null,
    setRetrievedTime: (newRetrievedTime: number | null) => set({ retrievedTime: newRetrievedTime }),
    retrievedPaused: null,
    setRetrievedPaused: (newRetrievedPaused: boolean | null) => set({ retrievedPaused: newRetrievedPaused }),
    retrievedSet: null,
    setRetrievedSet: (newRetrievedSet: number | null) => set({ retrievedSet: newRetrievedSet }),
    retrievedYet: false,
    setRetrievedYet: (newRetrievedYet: boolean) => set({ retrievedYet: newRetrievedYet }),

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

    exercise: (): primaryExerciseType | accessoryExerciseType | superSetType =>
        useStore.getState().program!.days[useStore.getState().currentDay].exercises[useStore.getState().currentExercise],

    db: SQLite.openDatabaseSync('programs.db'),
}));

const useProgramStore = create<programStoreType>((set) => ({
    addProgramForm: false,
    addDayForm: false,
    addExerciseForm: false,
    setAddProgramForm: (newForm: boolean) => set({ addProgramForm: newForm }),
    setAddDayForm: (newForm: boolean) => set({ addDayForm: newForm }),
    setAddExerciseForm: (newForm: boolean) => set({ addExerciseForm: newForm }),

    editProgram: null,
    editDay: null,
    editExercise: null,
    setEditProgram: (newProgram) => set({ editProgram: newProgram }),
    setEditDay: (newDay) => set({ editDay: newDay }),
    setEditExercise: (newExercise) => set({ editExercise: newExercise }),
}));

const useMusicStore = create<musicStoreType>((set) => ({
    loggedIn: false,
    setLoggedIn: (newLoggedIn: boolean) => set({ loggedIn: newLoggedIn }),
    accessToken: null,
    setAccessToken: (newAccessToken: string | null) => set({ accessToken: newAccessToken }),
    active: false,
    setActive: (newActive: boolean) => set({ active: newActive }),
    inQueue: false,
    setInQueue: (newInQueue: boolean) => set({ inQueue: newInQueue }),
    paused: false,
    setPaused: (newPaused: boolean) => set({ paused: newPaused }),
    volume: 1,
    setVolume: (newVolume: number) => set({ volume: newVolume }),
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
    timesReset: number,
    setTimesReset: (newTimesReset: number) => void,
    reset: () => void,
    time: number,
    setTime: (newTime: number) => void,
    paused: boolean,
    setPaused: (newPaused: boolean) => void,
    retrievedTime: number | null,
    setRetrievedTime: (newRetrievedTime: number | null) => void,
    retrievedPaused: boolean | null,
    setRetrievedPaused: (newRetrievedPaused: boolean | null) => void,
    retrievedSet: number | null,
    setRetrievedSet: (newRetrievedSet: number | null) => void,
    retrievedYet: boolean,
    setRetrievedYet: (newRetrievedYet: boolean) => void,
    program: programType | null,
    setProgram: (newProgram: programType | null) => void,
    isPrimaryExercise: (exercise: primaryExerciseType | accessoryExerciseType | superSetType) => exercise is primaryExerciseType,
    isAccessoryExercise: (exercise: primaryExerciseType | accessoryExerciseType | superSetType) => exercise is accessoryExerciseType,
    isSuperSet: (exercise: primaryExerciseType | accessoryExerciseType | superSetType) => exercise is superSetType,
    exercise: () => primaryExerciseType | accessoryExerciseType | superSetType,
    db: SQLite.SQLiteDatabase,
}

type programStoreType = {
    addProgramForm: boolean,
    addDayForm: boolean,
    addExerciseForm: boolean,
    setAddProgramForm: (newForm: boolean) => void,
    setAddDayForm: (newForm: boolean) => void,
    setAddExerciseForm: (newForm: boolean) => void,

    editProgram: string | null,
    editDay: string | null,
    editExercise: string | null,
    setEditProgram: (newProgram: string | null) => void,
    setEditDay: (newDay: string | null) => void,
    setEditExercise: (newExercise: string | null) => void,
}

type musicStoreType = {
    loggedIn: boolean,
    setLoggedIn: (newLoggedIn: boolean) => void,
    accessToken: string | null,
    setAccessToken: (newAccessToken: string | null) => void,
    active: boolean,
    setActive: (newActive: boolean) => void,
    inQueue: boolean,
    setInQueue: (newInQueue: boolean) => void,
    paused: boolean,
    setPaused: (newPaused: boolean) => void,
    volume: number,
    setVolume: (newVolume: number) => void,
}

export { useStore, useProgramStore, useMusicStore };