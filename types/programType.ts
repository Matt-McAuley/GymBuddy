type setType = {
    rest: number,
    weight: number,
    reps: number,
}

type exerciseType = {
    name: string,
    sets: setType[],
}

type superSetType = {
    exercise1: exerciseType,
    exercise2: exerciseType
}

type dayType = {
    name: string,
    color: string,
    exercises: (exerciseType | superSetType)[],
}

type programType = {
    name: string,
    days: dayType[]
}

export {setType, exerciseType, superSetType, dayType, programType};