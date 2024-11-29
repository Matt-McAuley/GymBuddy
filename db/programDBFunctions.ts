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

export function setCurrentProgram(db, programName: string | null) {
    db.runSync("UPDATE current_program SET program = ?", [programName]);
}

export function setNullIfCurrentProgram(db, programName: string) {
    const currentProgram = db.getFirstSync("SELECT * FROM current_program");
    if (currentProgram.program == programName) {
        db.runSync("UPDATE current_program SET program = ?", [null]);
    }
}

export function createNewProgram(db, programName: string, Sunday: string, Monday: string, Tuesday: string, Wednesday: string, Thursday: string, Friday: string, Saturday: string) {
    const program = db.getFirstSync('SELECT * FROM programs WHERE name = ?', programName);
    if (programName == null) return 'Must include a program name!';
    if (Sunday == null && Monday == null && Tuesday == null && Wednesday == null && Thursday == null && Friday == null && Saturday == null) return 'Must have at least one day!';
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

export function replaceProgram(db, oldProgramName: string | null, newProgramName: string | null, Sunday: string | null, Monday: string | null, Tuesday: string | null, Wednesday: string | null, Thursday: string | null, Friday: string | null, Saturday: string | null) {
    if (newProgramName == null) return 'Must include a program name!';
    if (Sunday == null && Monday == null && Tuesday == null && Wednesday == null && Thursday == null && Friday == null && Saturday == null) return 'Must have at least one day!';
    const program = db.getFirstSync('SELECT * FROM programs WHERE name = ?', newProgramName);
    if (program != null && oldProgramName != newProgramName) return 'Program with that name already exists!';
    db.runSync('DELETE FROM programs WHERE name = ?', oldProgramName);
    db.runSync("INSERT INTO programs (name, Sunday, Monday, Tuesday, Wednesday, Thursday, Friday, Saturday) VALUES " +
        "(?, ?, ?, ?, ?, ?, ?, ?)", newProgramName, Sunday, Monday, Tuesday, Wednesday, Thursday, Friday, Saturday);
    return 'success';
}

export function deleteProgram(db, programName: string) {
    db.runSync('DELETE FROM programs WHERE name = ?', programName);
}

export function getPrimaryExercises(db) {
    const primary_exercises = db.getAllSync("SELECT * FROM primary_exercises");
    return (primary_exercises == null) ? null : primary_exercises.map((primary_exercise) => (primary_exercise.name));
}

export function getAccessoryExercises(db) {
    const accessory_exercises = db.getAllSync("SELECT * FROM accessory_exercises");
    return (accessory_exercises == null) ? null : accessory_exercises.map((accessory_exercise) => (accessory_exercise.name));
}

export function createNewDay(db, dayName: string | null, dayColor: string | null, primaryExercise: string | null, accessoryExercise1: string | null, accessoryExercise2: string | null, accessoryExercise3: string | null, accessoryExercise4: string | null, superSet1: (string | null)[], superSet2: (string | null)[]) {
    const day = db.getFirstSync('SELECT * FROM days WHERE name = ?', dayName);
    if (dayName == null) return 'Must include a day name!';
    if (dayColor == null) return 'Must include a color!';
    if (primaryExercise == null && accessoryExercise1 == null && accessoryExercise2 == null && accessoryExercise3 == null && accessoryExercise4 == null && superSet1[0] == null && superSet1[1] == null && superSet2[0] == null && superSet2[1] == null) return 'Must have at least one exercise!';
    if (day != null) return 'Program with that name already exists!';
    db.runSync("INSERT INTO days (name, color, exercise_1, exercise_2, exercise_3, exercise_4, exercise_5, superset_1_1, superset_1_2, superset_2_1, superset_2_2) VALUES " +
        "(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", dayName, dayColor, primaryExercise, accessoryExercise1, accessoryExercise2, accessoryExercise3, accessoryExercise4, superSet1[0], superSet1[1], superSet2[0], superSet2[1]);
    return 'success';
}