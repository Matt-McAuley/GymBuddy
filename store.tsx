import { create } from 'zustand';
import exerciseInfoType from "@/types/exerciseInfoType";
import {programType} from "@/types/programType";

const useStore = create<storeType>((set) => ({
    set: 1,
    setSet: (newSet: number) => set({ set: newSet }),

    nextExerciseHandler: () => {
        const setExerciseInfo = useStore.getState().setExerciseInfo;
        const exerciseInfo = useStore.getState().exerciseInfo;
        const program = useStore.getState().program;
        const currentDay = program!.days[0];
        const primaryExercise = currentDay!.primaryExercise;
        const accessoryExercises = currentDay!.accessoryExercises;

        if (exerciseInfo.exerciseNumber === accessoryExercises.length+1) return;

        const newExerciseNumber = exerciseInfo.exerciseNumber + 1;
        const newExercise = accessoryExercises[newExerciseNumber - 2];

        const prevExercise = (newExerciseNumber === 2) ?
            primaryExercise.name : accessoryExercises[newExerciseNumber - 3].name;
        const prevWeight = (newExerciseNumber === 2) ?
            primaryExercise.weight_1 : accessoryExercises[newExerciseNumber - 3].weight;

        const nextExercise = (newExerciseNumber === accessoryExercises.length+1) ?
            'None' : accessoryExercises[newExerciseNumber - 1].name;
        const nextWeight = (newExerciseNumber === accessoryExercises.length+1) ?
            0 : accessoryExercises[newExerciseNumber - 1].weight;

        setExerciseInfo({
            currentExercise: newExercise.name,
            currentWeight: new Array(5).fill(accessoryExercises[newExerciseNumber - 2].weight),
            currentRest: newExercise.rest,
            currentSets: newExercise.sets,
            currentReps: new Array(5).fill(newExercise.reps),
            nextExercise: nextExercise,
            nextWeight: nextWeight,
            prevExercise: prevExercise,
            prevWeight: prevWeight,
            scheme: '5x5',
            exerciseNumber: newExerciseNumber,
        });
    },

    prevExerciseHandler: () => {
        const setExerciseInfo = useStore.getState().setExerciseInfo;
        const exerciseInfo = useStore.getState().exerciseInfo;
        const program = useStore.getState().program;
        const currentDay = program!.days[0];
        const primaryExercise = currentDay!.primaryExercise;
        const accessoryExercises = currentDay!.accessoryExercises;

        if (exerciseInfo.exerciseNumber === 1) return;

        const newExerciseNumber = exerciseInfo.exerciseNumber - 1;
        const newExercise = (newExerciseNumber === 1) ?
            primaryExercise : accessoryExercises[newExerciseNumber - 2];

        const prevExercise = (newExerciseNumber === 1) ?
            'None' : (newExerciseNumber === 2) ? primaryExercise.name :
                accessoryExercises[newExerciseNumber - 3].name;
        const prevWeight = (newExerciseNumber === 1) ?
            0 : (newExerciseNumber === 2) ? primaryExercise.weight_1 :
                accessoryExercises[newExerciseNumber - 3].weight;

        const nextExercise = (newExerciseNumber === '1') ?
            accessoryExercises[0].name : accessoryExercises[newExerciseNumber - 1].name;
        const nextWeight = (newExerciseNumber === '1') ?
            accessoryExercises[0].weight : accessoryExercises[newExerciseNumber - 1].weight;

        setExerciseInfo({
            currentExercise: newExercise.name,
            currentWeight: (newExerciseNumber === 1) ? [primaryExercise.weight_1, primaryExercise.weight_2, primaryExercise.weight_3, primaryExercise.weight_2, primaryExercise.weight_1] :
                new Array(5).fill(accessoryExercises[newExerciseNumber - 2].weight),
            currentRest: newExercise.rest,
            currentSets: newExercise.sets,
            currentReps: (newExerciseNumber === 1) ? [primaryExercise.reps_1, primaryExercise.reps_2, primaryExercise.reps_3, primaryExercise.reps_2, primaryExercise.reps_1] :
                new Array(5).fill(accessoryExercises[newExerciseNumber - 2].reps),
            nextExercise: nextExercise,
            nextWeight: nextWeight,
            prevExercise: prevExercise,
            prevWeight: prevWeight,
            scheme: '5x5',
            exerciseNumber: newExerciseNumber,
        });
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

    program: null,
    setProgram: (newProgram) => {set({ program: newProgram });}

}));

type storeType = {
    set: number,
    setSet: (newSet: number) => void
    nextExerciseHandler: () => void,
    prevExerciseHandler: () => void,
    exerciseInfo: exerciseInfoType,
    setExerciseInfo: (newInfo: exerciseInfoType) => void,
    program: programType | null,
    setProgram: (newProgram: programType | null) => void
}

export { useStore, storeType };