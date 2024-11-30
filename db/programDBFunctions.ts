export function getProgramNames(db) : string[] {
    const programs = db.getAllSync("SELECT * FROM programs");
    return (programs == null) ? null : programs.map((program) => (program.name));
}

export function getDayNames(db) : string[] {
    const days = db.getAllSync("SELECT * FROM days");
    return (days == null) ? null : days.map((day) => (day.name));
}

export function getDayNamesColors(db) {
    const days = db.getAllSync("SELECT * FROM days");
    return (days == null) ? null : days.map((day) => ({name: day.name, color: day.color}));
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

export function createNewProgram(db, programName: string | null, Sunday: string | null, Monday: string | null, Tuesday: string | null, Wednesday: string | null, Thursday: string | null, Friday: string | null, Saturday: string | null) {
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

export function createNewDay(db, name: string | null, color: string | null, exercise_1: string | null, exercise_1_placement: number, exercise_2: string | null, exercise_2_placement: number, exercise_3: string | null, exercise_3_placement: number, exercise_4: string | null, exercise_4_placement: number, exercise_5: string | null, exercise_5_placement: number, superset_1_1: string | null, superset_1_2: string | null, superset_1_placement: number, superset_2_1: string | null, superset_2_2: string | null, superset_2_placement: number) {
    const day = db.getFirstSync('SELECT * FROM days WHERE name = ?', name);
    if (name == null) return 'Must include a day name!';
    if (color == null) return 'Must include a color!';
    if (exercise_1 == null && exercise_2 == null && exercise_3 == null && exercise_4 == null && exercise_5 == null && superset_1_1 == null && superset_1_2 == null && superset_2_1 == null && superset_2_2 == null) return 'Must have at least one exercise!';
    if (new Set([exercise_1_placement.toString(), exercise_2_placement.toString(), exercise_3_placement.toString(), exercise_4_placement.toString(), exercise_5_placement.toString(), superset_1_placement.toString(), superset_2_placement.toString()]).size < 7) return 'Exercise order must be unique!';
    if ((superset_1_1 == null && superset_1_2 != null) || (superset_1_1 != null && superset_1_2 == null) || (superset_2_1 == null && superset_2_2 != null) || (superset_2_1 != null && superset_2_2 == null)) return 'Superset must have two exercises!';
    if (day != null) return 'Program with that name already exists!';
    db.runSync("INSERT INTO days (name, color, exercise_1, exercise_1_placement, exercise_2, exercise_2_placement, exercise_3, exercise_3_placement, exercise_4, exercise_4_placement, exercise_5, exercise_5_placement, superset_1_1, superset_1_2, superset_1_placement, superset_2_1, superset_2_2, superset_2_placement) VALUES " +
        "(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", name, color, exercise_1, exercise_1_placement, exercise_2, exercise_2_placement, exercise_3, exercise_3_placement, exercise_4, exercise_4_placement, exercise_5, exercise_5_placement, superset_1_1, superset_1_2, superset_1_placement, superset_2_1, superset_2_2, superset_2_placement);
    return 'success';
}

export function getDayByName(db, dayName: string) {
    const day = db.getFirstSync("SELECT * FROM days WHERE name = ?", dayName);
    let maxPlacement = Math.max(day.exercise_1_placement, day.exercise_2_placement, day.exercise_3_placement, day.exercise_4_placement, day.exercise_5_placement, day.superset_1_placement, day.superset_2_placement);

    const res = {
        exercise_1_placement: 0,
        exercise_2_placement: 0,
        exercise_3_placement: 0,
        exercise_4_placement: 0,
        exercise_5_placement: 0,
        superset_1_placement: 0,
        superset_2_placement: 0,
    }
    if (day.exercise_1_placement == null) {
        res.exercise_1_placement = maxPlacement + 1
        maxPlacement += 1;
    }
    else res.exercise_1_placement = day.exercise_1_placement;

    for (let i = 2; i <= 5; i++) {
        if (day[`exercise_${i}_placement`] == null) {
            res[`exercise_${i}_placement`] = maxPlacement + 1;
            maxPlacement += 1;
        }
        else res[`exercise_${i}_placement`] = day[`exercise_${i}_placement`];
    }

    for (let i = 1; i <= 2; i++) {
        if (day[`superset_${i}_placement`] == null) {
            res[`superset_${i}_placement`] = maxPlacement + 1;
            maxPlacement += 1;
        }
        else res[`superset_${i}_placement`] = day[`superset_${i}_placement`];
    }

    return {
        name: day.name,
        color: day.color,
        primary_exercise: day.exercise_1,
        primary_exercise_order: res.exercise_1_placement,
        accessory_exercise_1: day.exercise_2,
        accessory_exercise_1_order: res.exercise_2_placement,
        accessory_exercise_2: day.exercise_3,
        accessory_exercise_2_order: res.exercise_3_placement,
        accessory_exercise_3: day.exercise_4,
        accessory_exercise_3_order: res.exercise_4_placement,
        accessory_exercise_4: day.exercise_5,
        accessory_exercise_4_order: res.exercise_5_placement,
        superset_1_1: day.superset_1_1,
        superset_1_2: day.superset_1_2,
        superset_1_order: res.superset_1_placement,
        superset_2_1: day.superset_2_1,
        superset_2_2: day.superset_2_2,
        superset_2_order: res.superset_2_placement,
    }
}

export function deleteDay(db, dayName: string) {
    db.runSync('DELETE FROM days WHERE name = ?', dayName);
}

export function replaceDay(db, originalName: string, newName: string | null, color: string | null, exercise_1: string | null, exercise_1_placement: number, exercise_2: string | null, exercise_2_placement: number, exercise_3: string | null, exercise_3_placement: number, exercise_4: string | null, exercise_4_placement: number, exercise_5: string | null, exercise_5_placement: number, superset_1_1: string | null, superset_1_2: string | null, superset_1_placement: number, superset_2_1: string | null, superset_2_2: string | null, superset_2_placement: number) {
    if (newName == null) return 'Must include a day name!';
    if (color == null) return 'Must include a color!';
    if (exercise_1 == null && exercise_2 == null && exercise_3 == null && exercise_4 == null && exercise_5 == null && superset_1_1 == null && superset_1_2 == null && superset_2_1 == null && superset_2_2 == null) return 'Must have at least one exercise!';
    if (new Set([exercise_1_placement.toString(), exercise_2_placement.toString(), exercise_3_placement.toString(), exercise_4_placement.toString(), exercise_5_placement.toString(), superset_1_placement.toString(), superset_2_placement.toString()]).size < 7) return 'Exercise order must be unique!';
    if ((superset_1_1 == null && superset_1_2 != null) || (superset_1_1 != null && superset_1_2 == null) || (superset_2_1 == null && superset_2_2 != null) || (superset_2_1 != null && superset_2_2 == null)) return 'Superset must have two exercises!';
    const day = db.getFirstSync('SELECT * FROM days WHERE name = ?', newName);
    if (day != null && originalName != newName) return 'Day with that name already exists!';
    db.runSync('DELETE FROM days WHERE name = ?', originalName);
    db.runSync("INSERT INTO days (name, color, exercise_1, exercise_1_placement, exercise_2, exercise_2_placement, exercise_3, exercise_3_placement, exercise_4, exercise_4_placement, exercise_5, exercise_5_placement, superset_1_1, superset_1_2, superset_1_placement, superset_2_1, superset_2_2, superset_2_placement) VALUES " +
        "(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", newName, color, exercise_1, exercise_1_placement, exercise_2, exercise_2_placement, exercise_3, exercise_3_placement, exercise_4, exercise_4_placement, exercise_5, exercise_5_placement, superset_1_1, superset_1_2, superset_1_placement, superset_2_1, superset_2_2, superset_2_placement);
    return 'success';
}