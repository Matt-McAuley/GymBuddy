type primaryExerciseType = {
    name: string,
    sets: number,
    reps1: number,
    weight1: number,
    reps2: number,
    weight2: number,
    reps3: number,
    weight3: number
}

type accessoryExerciseType = {
    name: string,
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