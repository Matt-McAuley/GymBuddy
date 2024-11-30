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
    const programsWithDay = db.getAllSync('SELECT * FROM programs WHERE Sunday = ? OR Monday = ? OR Tuesday = ? OR Wednesday = ? OR Thursday = ? OR Friday = ? OR Saturday = ?', originalName, originalName, originalName, originalName, originalName, originalName, originalName);
    if (day != null && originalName != newName) return 'Day with that name already exists!';
    db.runSync('DELETE FROM days WHERE name = ?', originalName);
    db.runSync("INSERT INTO days (name, color, exercise_1, exercise_1_placement, exercise_2, exercise_2_placement, exercise_3, exercise_3_placement, exercise_4, exercise_4_placement, exercise_5, exercise_5_placement, superset_1_1, superset_1_2, superset_1_placement, superset_2_1, superset_2_2, superset_2_placement) VALUES " +
        "(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", newName, color, exercise_1, exercise_1_placement, exercise_2, exercise_2_placement, exercise_3, exercise_3_placement, exercise_4, exercise_4_placement, exercise_5, exercise_5_placement, superset_1_1, superset_1_2, superset_1_placement, superset_2_1, superset_2_2, superset_2_placement);
    programsWithDay.forEach((program) => {
        ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].forEach((day) => {
            if (program[day] == originalName) db.runSync(`UPDATE programs SET ${day} = ? WHERE name = ?`, newName, program.name);
        });
    });
    return 'success';
}

export function createNewPrimaryExercise(db, name: string | null, rest: number | null, weight_1: number | null, reps_1: number | null, weight_2: number | null, reps_2: number | null, weight_3: number | null, reps_3: number | null) {
    const primary_exercise = db.getFirstSync('SELECT * FROM primary_exercises WHERE name = ?', name);
    const accessory_exercise = db.getFirstSync('SELECT * FROM accessory_exercises WHERE name = ?', name);
    if (name == null) return 'Must include a primary exercise name!';
    if (rest == null) return 'Must include a rest time!';
    if (weight_1 == null || reps_1 == null) return 'Must include weight and reps for first set!';
    if (weight_2 == null || reps_2 == null) return 'Must include weight and reps for second set!';
    if (weight_3 == null || reps_3 == null) return 'Must include weight and reps for third set!';
    if (rest < 0 || weight_1 < 0 || reps_1 < 0 || weight_2 < 0 || reps_2 < 0 || weight_3 < 0 || reps_3 < 0) return 'Values must be positive!';
    if (primary_exercise != null || accessory_exercise != null) return 'Exercise with that name already exists!';
    db.runSync("INSERT INTO primary_exercises (name, rest, weight_1, reps_1, weight_2, reps_2, weight_3, reps_3) VALUES " +
        "(?, ?, ?, ?, ?, ?, ?, ?)", name, rest, weight_1, reps_1, weight_2, reps_2, weight_3, reps_3);
    return 'success';
}

export function createNewAccessoryExercise(db, name: string | null, rest: number | null, sets: number | null, weight: number | null, reps: number | null) {
    const accessory_exercise = db.getFirstSync('SELECT * FROM accessory_exercises WHERE name = ?', name);
    const primary_exercise = db.getFirstSync('SELECT * FROM primary_exercises WHERE name = ?', name);
    if (name == null) return 'Must include an accessory exercise name!';
    if (rest == null) return 'Must include a rest time!';
    if (sets == null) return 'Must include a number of sets!';
    if (weight == null) return 'Must include weight!';
    if (reps == null) return 'Must include reps!';
    if (rest < 0 || sets < 0 || weight < 0 || reps < 0) return 'Values must be positive!';
    if (accessory_exercise != null || primary_exercise != null) return 'Exercise with that name already exists!';
    db.runSync("INSERT INTO accessory_exercises (name, rest, sets, weight, reps) VALUES " +
        "(?, ?, ?, ?, ?)", name, rest, sets, weight, reps);
    return 'success';
}

function deletePlacements(db, name: string) {
    const daysWithExercise = db.getAllSync('SELECT * FROM days WHERE exercise_1 = ? OR exercise_2 = ? OR exercise_3 = ? OR exercise_4 = ? OR exercise_5 = ? OR superset_1_1 = ? OR superset_1_2 = ? OR superset_2_1 = ? OR superset_2_2 = ?', name, name, name, name, name, name, name, name, name);
    daysWithExercise.forEach((day) => {
        ['exercise_1', 'exercise_2', 'exercise_3', 'exercise_4', 'exercise_5', 'superset_1_1', 'superset_1_2', 'superset_2_1', 'superset_2_2'].forEach((exercise) => {
            if (day[exercise] == name) db.runSync(`UPDATE days SET ${exercise}_placement = NULL WHERE name = ?`, day.name);
        });
    });
}

export function deleteExercise(db, name: string) {
    deletePlacements(db, name);
    db.runSync('DELETE FROM primary_exercises WHERE name = ?', name);
    db.runSync('DELETE FROM accessory_exercises WHERE name = ?', name);
}

export function getPrimaryExerciseByName(db, exerciseName: string) {
    const exercise = db.getFirstSync("SELECT * FROM primary_exercises WHERE name = ?", exerciseName);
    return (exercise == null) ? null : {
        name: exercise.name,
        rest: exercise.rest,
        weight_1: exercise.weight_1,
        reps_1: exercise.reps_1,
        weight_2: exercise.weight_2,
        reps_2: exercise.reps_2,
        weight_3: exercise.weight_3,
        reps_3: exercise.reps_3,
    }
}

export function getAccessoryExerciseByName(db, exerciseName: string) {
    const exercise = db.getFirstSync("SELECT * FROM accessory_exercises WHERE name = ?", exerciseName);
    return (exercise == null) ? null : {
        name: exercise.name,
        rest: exercise.rest,
        sets: exercise.sets,
        weight: exercise.weight,
        reps: exercise.reps,
    }
}

export function replaceAccessoryExercise(db, originalName: string, newName: string | null, rest: string | null, sets: string | null, weight: string | null, reps: string | null) {
    if (newName == null) return 'Must include an accessory exercise name!';
    if (rest == null) return 'Must include a rest time!';
    if (sets == null) return 'Must include a number of sets!';
    if (weight == null) return 'Must include weight!';
    if (reps == null) return 'Must include reps!';
    if (rest < 0 || sets < 0 || weight < 0 || reps < 0) return 'Values must be positive!';
    const accessory_exercise = db.getFirstSync('SELECT * FROM accessory_exercises WHERE name = ?', newName);
    const primary_exercise = db.getFirstSync('SELECT * FROM primary_exercises WHERE name = ?', newName);
    if (originalName != newName && (accessory_exercise != null || primary_exercise != null)) return 'Exercise with that name already exists!';
    const daysWithExercise = db.getAllSync('SELECT * FROM days WHERE exercise_1 = ? OR exercise_2 = ? OR exercise_3 = ? OR exercise_4 = ? OR exercise_5 = ? OR superset_1_1 = ? OR superset_1_2 = ? OR superset_2_1 = ? OR superset_2_2 = ?', originalName, originalName, originalName, originalName, originalName, originalName, originalName, originalName, originalName);
    const superSetsWithExerciseAsFirst = db.getAllSync('SELECT * FROM supersets WHERE exercise_1 = ?', originalName);
    const superSetsWithExerciseAsSecond = db.getAllSync('SELECT * FROM supersets WHERE exercise_2 = ?', originalName);
    db.runSync('DELETE FROM accessory_exercises WHERE name = ?', originalName);
    db.runSync("INSERT INTO accessory_exercises (name, rest, sets, weight, reps) VALUES " +
        "(?, ?, ?, ?, ?)", newName, rest, sets, weight, reps);
    daysWithExercise.forEach((day) => {
        ['exercise_1', 'exercise_2', 'exercise_3', 'exercise_4', 'exercise_5'].forEach((exercise) => {
            if (day[exercise] == originalName) db.runSync(`UPDATE days SET ${exercise} = ? WHERE name = ?`, newName, day.name);
        });
    });
    superSetsWithExerciseAsFirst.forEach((superset) => {
        db.runSync('INSERT INTO supersets (exercise_1, exercise_2) VALUES (?, ?)', newName, superset.exercise_2);
    });
    superSetsWithExerciseAsSecond.forEach((superset) => {
        db.runSync('INSERT INTO supersets (exercise_1, exercise_2) VALUES (?, ?)', superset.exercise_1, newName);
    });
    daysWithExercise.forEach((day) => {
        ['superset_1', 'superset_2'].forEach((exercise) => {
            if (day[`${exercise}_1`] == originalName) db.runSync(`UPDATE days SET ${exercise}_1 = ?, ${exercise}_2 = ? WHERE name = ?`, newName, day[`${exercise}_2`], day.name);
            if (day[`${exercise}_2`] == originalName) db.runSync(`UPDATE days SET ${exercise}_2 = ?, ${exercise}_1 = ? WHERE name = ?`, newName, day[`${exercise}_1`], day.name);
        });
    });
    return 'success';
}

export function replacePrimaryExercise(db, originalName: string, newName: string | null, rest: string | null, weight_1: string | null, reps_1: string | null, weight_2: string | null, reps_2: string | null, weight_3: string | null, reps_3: string | null) {
    if (newName == null) return 'Must include an accessory exercise name!';
    if (rest == null) return 'Must include a rest time!';
    if (weight_1 == null || reps_1 == null) return 'Must include weight and reps for first set!';
    if (weight_2 == null || reps_2 == null) return 'Must include weight and reps for second set!';
    if (weight_3 == null || reps_3 == null) return 'Must include weight and reps for third set!';
    if (rest < 0 || weight_1 < 0 || reps_1 < 0 || weight_2 < 0 || reps_2 < 0 || weight_3 < 0 || reps_3 < 0) return 'Values must be positive!';
    const accessory_exercise = db.getFirstSync('SELECT * FROM accessory_exercises WHERE name = ?', newName);
    const primary_exercise = db.getFirstSync('SELECT * FROM primary_exercises WHERE name = ?', newName);
    if (originalName != newName && (accessory_exercise != null || primary_exercise != null)) return 'Exercise with that name already exists!';
    const daysWithExercise = db.getAllSync('SELECT * FROM days WHERE exercise_1 = ? OR exercise_2 = ? OR exercise_3 = ? OR exercise_4 = ? OR exercise_5 = ? OR superset_1_1 = ? OR superset_1_2 = ? OR superset_2_1 = ? OR superset_2_2 = ?', originalName, originalName, originalName, originalName, originalName, originalName, originalName, originalName, originalName);
    db.runSync('DELETE FROM primary_exercises WHERE name = ?', originalName);
    db.runSync("INSERT INTO primary_exercises (name, rest, weight_1, reps_1, weight_2, reps_2, weight_3, reps_3) VALUES " +
        "(?, ?, ?, ?, ?, ?, ?, ?)", newName, rest, weight_1, reps_1, weight_2, reps_2, weight_3, reps_3);
    daysWithExercise.forEach((day) => {
        ['exercise_1', 'exercise_2', 'exercise_3', 'exercise_4', 'exercise_5', 'superset_1_1', 'superset_1_2', 'superset_2_1', 'superset_2_2'].forEach((exercise) => {
            if (day[exercise] == originalName) db.runSync(`UPDATE days SET ${exercise} = ? WHERE name = ?`, newName, day.name);
        });
    });
    return 'success';
}