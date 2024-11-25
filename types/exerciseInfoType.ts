type exerciseInfoType = {
    currentExercise: string,
    currentWeight: number,
    nextExercise: string,
    nextWeight: number,
    prevExercise: string,
    prevWeight: number,
    scheme: string
    nextExerciseHandler: () => void,
    prevExerciseHandler: () => void
}

export default exerciseInfoType;