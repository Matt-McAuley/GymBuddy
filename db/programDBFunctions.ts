import {programType, dayType, primaryExerciseType, accessoryExerciseType, superSetType} from "@/types/programType";

export function getProgramNames(db) : string[] {
    const programs = db.getAllSync("SELECT * FROM programs");
    return (programs == null) ? null : programs.map((program) => (program.name));
}

export function setCurrentProgram(db, programName: string) {
    db.runSync("UPDATE current_program SET program = ?", [programName]);
}