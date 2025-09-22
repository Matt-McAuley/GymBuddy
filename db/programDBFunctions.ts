import {setType, exerciseType, superSetType, dayType, programType} from "@/types/programType";
import * as SQLite from "expo-sqlite";

export function getProgramNames(db: SQLite.SQLiteDatabase) : string[] {
    const programs = db.getAllSync("SELECT * FROM programs ORDER BY name") as any[];
    return programs.map((program) => (program.name));
}

export function getDayNames(db: SQLite.SQLiteDatabase) : string[] {
    const days = db.getAllSync("SELECT * FROM days ORDER BY name") as any[];
    return days.map((day) => (day.name));
}

export function getDayNamesColors(db: SQLite.SQLiteDatabase) {
    const days = db.getAllSync("SELECT * FROM days ORDER BY name") as any[];
    return days.map((day) => ({name: day.name, color: day.color}));
}

export function getExerciseNames(db: SQLite.SQLiteDatabase) {
    let exercises = db.getAllSync("SELECT * FROM exercises ORDER BY name") as any[];
    return exercises.map((exercise) => exercise.name);
}

export function setCurrentProgram(db: SQLite.SQLiteDatabase, programName: string | null) {
    const currentProgram = db.getFirstSync("SELECT * FROM current_program");
    if (currentProgram == null) {
        db.runSync("INSERT INTO current_program (program) VALUES (?)", programName);
        return;
    }
    db.runSync("UPDATE current_program SET program = ?", [programName]);
}

export function setNullIfCurrentProgram(db: SQLite.SQLiteDatabase, programName: string) {
    const currentProgram = db.getFirstSync("SELECT * FROM current_program") as any;
    if (currentProgram.program == programName) {
        db.runSync("UPDATE current_program SET program = ?", [null]);
    }
}

export function createNewProgram(db: SQLite.SQLiteDatabase, programName: string | null, Sunday: string | null, Monday: string | null, Tuesday: string | null, Wednesday: string | null, Thursday: string | null, Friday: string | null, Saturday: string | null) {
    const program = db.getFirstSync('SELECT * FROM programs WHERE name = ?', programName);
    if (programName == null) return 'Must include a program name!';
    if (Sunday == null && Monday == null && Tuesday == null && Wednesday == null && Thursday == null && Friday == null && Saturday == null) return 'Must have at least one day!';
    if (program != null) return 'Program with that name already exists!';
    db.runSync("INSERT INTO programs (name, Sunday, Monday, Tuesday, Wednesday, Thursday, Friday, Saturday) VALUES " +
        "(?, ?, ?, ?, ?, ?, ?, ?)", programName, Sunday, Monday, Tuesday, Wednesday, Thursday, Friday, Saturday);
    return 'success';
}

export function getProgramByName(db: SQLite.SQLiteDatabase, programName: string) {
    const program = db.getFirstSync("SELECT * FROM programs WHERE name = ?", programName) as any;
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

export function replaceProgram(db: SQLite.SQLiteDatabase, oldProgramName: string | null, newProgramName: string | null, Sunday: string | null, Monday: string | null, Tuesday: string | null, Wednesday: string | null, Thursday: string | null, Friday: string | null, Saturday: string | null) {
    if (newProgramName == null) return 'Must include a program name!';
    if (Sunday == null && Monday == null && Tuesday == null && Wednesday == null && Thursday == null && Friday == null && Saturday == null) return 'Must have at least one day!';
    const program = db.getFirstSync('SELECT * FROM programs WHERE name = ?', newProgramName);
    if (program != null && oldProgramName != newProgramName) return 'Program with that name already exists!';
    db.runSync('DELETE FROM programs WHERE name = ?', oldProgramName);
    db.runSync("INSERT INTO programs (name, Sunday, Monday, Tuesday, Wednesday, Thursday, Friday, Saturday) VALUES " +
        "(?, ?, ?, ?, ?, ?, ?, ?)", newProgramName, Sunday, Monday, Tuesday, Wednesday, Thursday, Friday, Saturday);
    return 'success';
}

export function deleteProgram(db: SQLite.SQLiteDatabase, programName: string) {
    db.runSync('DELETE FROM programs WHERE name = ?', programName);
}

export function getExercises(db: SQLite.SQLiteDatabase) {
    const exercises = db.getAllSync("SELECT * FROM exercises ORDER BY name") as any[];
    return (exercises == null) ? null : exercises.map((exercise) => (exercise.name));
}

export function createNewDay(db: SQLite.SQLiteDatabase, name: string | null, color: string | null, exercises: string[]) {
    const day = db.getFirstSync('SELECT * FROM days WHERE name = ?', name);
    if (name == null) return 'Must include a day name!';
    if (color == null) return 'Must include a color!';
    if (day != null) return 'Day with that name already exists!';
    if (exercises == null || exercises.length === 0) return 'Must have at least one exercise!';
    db.runSync("INSERT INTO days (name, color) VALUES (?, ?)", name, color);
    exercises.forEach((exercise, index) => {
        if (exercise.includes(',')) {
            const [superset1, superset2] = exercise.split(',').map(s => s.trim());
            db.runSync(`INSERT INTO day_details (name, exercise_index, superset_1, superset_2) VALUES (?, ?, ?, ?)`, name, index, superset1, superset2);
        }
        else {
            db.runSync(`INSERT INTO day_details (name, exercise_index, exercise) VALUES (?, ?, ?)`, name, index, exercise);
        }
    });
    return 'success';
}

export function getDayByName(db: SQLite.SQLiteDatabase, dayName: string) {
    const day = db.getFirstSync("SELECT * FROM days WHERE name = ?", dayName) as any;
    const dayDetails = db.getAllSync("SELECT * FROM day_details WHERE name = ? ORDER BY exercise_index", dayName) as any[];

    return {
        name: day.name,
        color: day.color,
        exercises: dayDetails.map((detail) => ({
            exercise: detail.exercise,
            superset_1: detail.superset_1,
            superset_2: detail.superset_2
        }))
    };
}

export function deleteDay(db: SQLite.SQLiteDatabase, dayName: string) {
    db.runSync('DELETE FROM days WHERE name = ?', dayName);
}

export function replaceDay(db: SQLite.SQLiteDatabase, originalName: string, newName: string | null, color: string | null, exercises: string[]) {
    if (newName == null) return 'Must include a day name!';
    if (color == null) return 'Must include a color!';
    if (exercises === null ||exercises.length === 0) return 'Must have at least one exercise!';
    const day = db.getFirstSync('SELECT * FROM days WHERE name = ?', newName);
    const programsWithDay = db.getAllSync('SELECT * FROM programs WHERE Sunday = ? OR Monday = ? OR Tuesday = ? OR Wednesday = ? OR Thursday = ? OR Friday = ? OR Saturday = ?', originalName, originalName, originalName, originalName, originalName, originalName, originalName) as any[];
    if (day != null && originalName != newName) return 'Day with that name already exists!';
    db.runSync('DELETE FROM days WHERE name = ?', originalName);
    db.runSync("INSERT INTO days (name, color) VALUES (?, ?)", newName, color);
    exercises.forEach((exercise, index) => {
        if (exercise.includes(',')) {
            const [superset1, superset2] = exercise.split(',').map(s => s.trim());
            db.runSync(`INSERT INTO day_details (name, exercise_index, superset_1, superset_2) VALUES (?, ?, ?, ?)`, newName, index, superset1, superset2);
        }
        else {
            db.runSync(`INSERT INTO day_details (name, exercise_index, exercise) VALUES (?, ?, ?)`, newName, index, exercise);
        }
    });
    programsWithDay.forEach((program) => {
        ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].forEach((day) => {
            if (program[day] == originalName) db.runSync(`UPDATE programs SET ${day} = ? WHERE name = ?`, newName, program.name);
        });
    });
    return 'success';
}

export function createNewExercise(db: SQLite.SQLiteDatabase, name: string | null, sets: setType[] | null) {
    const exercise = db.getFirstSync('SELECT * FROM exercises WHERE name = ?', name);
    if (exercise != null) return 'Exercise with that name already exists!';
    if (name == null) return 'Must include an exercise name!';
    if (sets == null || sets.length === 0) return 'Must have at least one set!';
    if (sets.some(set => set.rest < 0 ||  set.weight < 0 || set.reps < 0)) return 'Values must be positive!';
    db.runSync("INSERT INTO exercises (name) VALUES (?)", name);
    sets.forEach((set, index) => {
        db.runSync("INSERT INTO exercise_details (name, set_index, rest, weight, reps) VALUES (?, ?, ?, ?, ?)", name, index, set.rest, set.weight, set.reps);
    });
    return 'success';
}


export function deleteExercise(db: SQLite.SQLiteDatabase, name: string) {
    const detailsWithExercise = db.getAllSync('SELECT * FROM day_details WHERE exercise = ? OR superset_1 = ? OR superset_2 = ?', name, name, name) as any[];
    detailsWithExercise.forEach((detail) => {
        db.runSync('DELETE FROM day_details WHERE name = ? AND exercise_index = ?', detail.name, detail.exercise_index);
    });
    db.runSync('DELETE FROM exercises WHERE name = ?', name);
}


export function getExerciseByName(db: SQLite.SQLiteDatabase, exerciseName: string) {
    const exercise = db.getFirstSync("SELECT * FROM exercises WHERE name = ?", exerciseName) as any;
    const details = db.getAllSync("SELECT * FROM exercise_details WHERE name = ? ORDER BY set_index", exerciseName) as any[];
    return {
        name: exercise.name,
        sets: details.map(detail => ({
            rest: detail.rest,
            weight: detail.weight,
            reps: detail.reps
        }))
    }
}

export function replaceExercise(db: SQLite.SQLiteDatabase, originalName: string, newName: string | null, sets: setType[]) {
    if (newName == null) return 'Must include an exercise name!';
    if (sets == null || sets.length === 0) return 'Must include a number of sets!';
    if (sets.some(set => set.rest < 0 ||  set.weight < 0 || set.reps < 0)) return 'Values must be positive!';
    const exercise = db.getFirstSync('SELECT * FROM exercises WHERE name = ?', newName);
    if (originalName != newName && exercise != null) return 'Exercise with that name already exists!';
    const supersetsWithExerciseAsFirst = db.getAllSync('SELECT * FROM supersets WHERE exercise_1 = ?', originalName) as any[];
    const supersetsWithExerciseAsSecond = db.getAllSync('SELECT * FROM supersets WHERE exercise_2 = ?', originalName) as any[];
    const dayDetailsWithExercise = db.getAllSync('SELECT * FROM day_details WHERE exercise = ?', originalName) as any[];
    db.runSync('DELETE FROM exercises WHERE name = ?', originalName);
    db.runSync('INSERT INTO exercises (name) VALUES (?)', newName);
    sets.forEach((set, index) => {
        db.runSync("INSERT INTO exercise_details (name, set_index, rest, weight, reps) VALUES " +
            "(?, ?, ?, ?, ?)", newName, index, set.rest, set.weight, set.reps);
    });
    dayDetailsWithExercise.forEach((day) => {
        db.runSync('UPDATE day_details SET exercise = ? WHERE name = ? AND exercise_index = ?', newName, day.name, day.exercise_index);
    });
    supersetsWithExerciseAsFirst.forEach((superset) => {
        db.runSync('INSERT INTO supersets (exercise_1, exercise_2) VALUES (?, ?)', newName, superset.exercise_2);
    });
    supersetsWithExerciseAsSecond.forEach((superset) => {
        db.runSync('INSERT INTO supersets (exercise_1, exercise_2) VALUES (?, ?)', superset.exercise_1, newName);
    });
    
    const dayDetailsWithSuperset = db.getAllSync('SELECT * FROM day_details WHERE superset_1 = ? OR superset_2 = ?', originalName, originalName) as any[];
    dayDetailsWithSuperset.forEach((day) => {
        const updatedSuperset1 = day.superset_1 === originalName ? newName : day.superset_1;
        const updatedSuperset2 = day.superset_2 === originalName ? newName : day.superset_2;
        db.runSync('UPDATE day_details SET superset_1 = ?, superset_2 = ? WHERE name = ? AND exercise_index = ?', updatedSuperset1, updatedSuperset2, day.name, day.exercise_index);
    });
    return 'success';
}