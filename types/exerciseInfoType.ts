type exerciseInfoType = {
    currentExercise: string,
    currentWeight: number,
    nextExercise: string,
    nextWeight: string,
    prevExercise: string,
    prevWeight: string,
    scheme: string
    nextExerciseHandler: () => void,
    prevExerciseHandler: () => void
}

export default exerciseInfoType;