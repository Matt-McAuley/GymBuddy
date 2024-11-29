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

export function createNewProgram(db, programName: string, Sunday: string, Monday: string, Tuesday: string, Wednesday: string, Thursday: string, Friday: string, Saturday: string) {
    const program = db.getFirstSync('SELECT * FROM programs WHERE name = ?', programName);
    if (programName == '') return 'Must include a program name!';
    if (Sunday == '' && Monday == '' && Tuesday == '' && Wednesday == '' && Thursday == '' && Friday == '' && Saturday == '') return 'Must have at least one day!';
    if (program != null) return 'Program with that name already exists!';
    db.runSync("INSERT INTO programs (name, Sunday, Monday, Tuesday, Wednesday, Thursday, Friday, Saturday) VALUES " +
        "(?, ?, ?, ?, ?, ?, ?, ?)", programName, Sunday, Monday, Tuesday, Wednesday, Thursday, Friday, Saturday);
    return 'success';
}

export function getProgramByName(db, programName: string) {
    const program = db.getFirstSync("SELECT * FROM programs WHERE name = ?", programName);
    return {
        name: program.name,
        Sunday: program.Sunday,
        Monday: program.Monday,
        Tuesday: program.Tuesday,
        Wednesday: program.Wednesday,
        Thursday: program.Thursday,
        Friday: program.Friday,
        Saturday: program.Saturday,
    }
}

export function replaceProgram(db, oldProgramName :string, newProgramName: string, Sunday: string, Monday: string, Tuesday: string, Wednesday: string, Thursday: string, Friday: string, Saturday: string) {
    if (newProgramName == '') return 'Must include a program name!';
    if (Sunday == '' && Monday == '' && Tuesday == '' && Wednesday == '' && Thursday == '' && Friday == '' && Saturday == '') return 'Must have at least one day!';
    const program = db.getFirstSync('SELECT * FROM programs WHERE name = ?', newProgramName);
    if (program != null && oldProgramName != newProgramName) return 'Program with that name already exists!';
    console.log(oldProgramName);
    db.runSync('DELETE FROM programs WHERE name = ?', oldProgramName);
    db.runSync("INSERT INTO programs (name, Sunday, Monday, Tuesday, Wednesday, Thursday, Friday, Saturday) VALUES " +
        "(?, ?, ?, ?, ?, ?, ?, ?)", newProgramName, Sunday, Monday, Tuesday, Wednesday, Thursday, Friday, Saturday);
    return 'success';
}

export function deleteProgram(db, programName: string) {
    db.runSync('DELETE FROM programs WHERE name = ?', programName);
}