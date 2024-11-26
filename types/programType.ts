type primaryExerciseType = {
    name: string,
    rest: number,
    sets: number,
    weight_1: number,
    weight_2: number,
    weight_3: number,
    reps_1: number,
    reps_2: number,
    reps_3: number
}

type accessoryExerciseType = {
    name: string,
    rest: number,
    sets: number,
    reps: number,
    weight: number,
}

type superSetType = {
    exercise1: accessoryExerciseType,
    exercise2: accessoryExerciseType,
    placement: number
}

type dayType = {
    name: string,
    color: string,
    primaryExercise: primaryExerciseType,
    accessoryExercises: accessoryExerciseType[],
    supersetExercises: superSetType[],
}

type programType = {
    name: string,
    days: (dayType | null)[]
}

export {programType, dayType, accessoryExerciseType, primaryExerciseType};