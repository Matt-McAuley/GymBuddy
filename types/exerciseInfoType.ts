type exerciseInfoType = {
    currentExercise: string,
    currentWeight: number[],
    currentRest: number,
    currentSets: number,
    currentReps: number[],
    nextExercise: string,
    nextWeight: number,
    prevExercise: string,
    prevWeight: number,
    scheme: string
    exerciseNumber: number,
    nextExerciseHandler: () => void,
    prevExerciseHandler: () => void
}

export default exerciseInfoType;