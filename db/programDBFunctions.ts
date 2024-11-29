import {programType, dayType, primaryExerciseType, accessoryExerciseType, superSetType} from "@/types/programType";

export function getProgramNames(db) : string[] {
    const programs = db.getAllSync("SELECT * FROM programs");
    return (programs == null) ? null : programs.map((program) => (program.name));
}

export function getDayNames(db) : string[] {
    const days = db.getAllSync("SELECT * FROM days");
    return (days == null) ? null : days.map((day) => (day.name));
}

export function getExerciseNames(db) : string[] {
    let accessory_exercises = db.getAllSync("SELECT * FROM accessory_exercises");
    accessory_exercises = (accessory_exercises == null) ? [] : accessory_exercises;
    let primary_exercises = db.getAllSync("SELECT * FROM primary_exercises");
    primary_exercises = (primary_exercises == null) ? [] : primary_exercises;
    return (accessory_exercises.length == 0 && primary_exercises.length == 0) ? null
        : accessory_exercises.concat(primary_exercises).map((accessory_exercises) => (accessory_exercises.name));
}

export function setCurrentProgram(db, programName: string) {
    db.runSync("UPDATE current_program SET program = ?", [programName]);
}

export function createNewProgram(db, programName: string, days: string[]) {
    db.runSync("INSERT INTO programs (name, Monday, Tuesday, Wednesday, Thursday, Friday, Saturday, Sunday) VALUES " +
        "(?, ?, ?, ?, ?, ?, ?, ?)", programName, days[0], days[1], days[2], days[3], days[4], days[5], days[6]);
}