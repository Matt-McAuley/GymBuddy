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
    reps: string,
    weight: string,
    order: number
}

type dayType = {
    name: string,
    color: string,
    primaryExercise: primaryExerciseType,
    exercises: accessoryExerciseType[]
}

type programType = {
    name: string,
    days: dayType[]
}

export default programType;