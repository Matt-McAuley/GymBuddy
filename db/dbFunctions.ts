import {programType, dayType, primaryExerciseType, accessoryExerciseType, superSetType} from "@/types/programType";

const dbSetup = (db) => {
    try {
        db.execSync(`
            CREATE TABLE IF NOT EXISTS accessory_exercises (
                name TEXT PRIMARY KEY NOT NULL,
                rest INTEGER NOT NULL,
                sets INTEGER NOT NULL,
                weight INTEGER NOT NULL,
                reps INTEGER NOT NULL
            );
        `);

        db.execSync(`
            CREATE TABLE IF NOT EXISTS primary_exercises (
                name TEXT PRIMARY KEY NOT NULL,
                rest INTEGER NOT NULL,
                weight_1 INTEGER NOT NULL,
                weight_2 INTEGER NOT NULL,
                weight_3 INTEGER NOT NULL,
                reps_1 INTEGER NOT NULL,
                reps_2 INTEGER NOT NULL,
                reps_3 INTEGER NOT NULL
            );
        `);

        db.execSync(`
            CREATE TABLE IF NOT EXISTS supersets (
                exercise_1 TEXT NOT NULL,
                exercise_2 TEXT NOT NULL,
                PRIMARY KEY (exercise_1, exercise_2),
                FOREIGN KEY (exercise_1) REFERENCES accessory_exercises(name) ON DELETE CASCADE,
                FOREIGN KEY (exercise_2) REFERENCES accessory_exercises(name) ON DELETE CASCADE
            );
        `);

        db.execSync(`
            CREATE TABLE IF NOT EXISTS days (
                name TEXT PRIMARY KEY NOT NULL,
                color TEXT NOT NULL,
                exercise_1 TEXT NULL,
                exercise_1_placement INTEGER NULL,
                exercise_2 TEXT NULL,
                exercise_2_placement INTEGER NULL,
                exercise_3 TEXT NULL,
                exercise_3_placement INTEGER NULL,
                exercise_4 TEXT NULL,
                exercise_4_placement INTEGER NULL,
                exercise_5 TEXT NULL,
                exercise_5_placement INTEGER NULL,
                superset_1_1 TEXT NULL,
                superset_1_2 TEXT NULL,
                superset_1_placement INTEGER NULL,
                superset_2_1 TEXT NULL,
                superset_2_2 TEXT NULL,
                superset_2_placement INTEGER NULL,
                FOREIGN KEY (exercise_1) REFERENCES primary_exercises(name) ON DELETE SET NULL,
                FOREIGN KEY (exercise_2) REFERENCES accessory_exercises(name) ON DELETE SET NULL,
                FOREIGN KEY (exercise_3) REFERENCES accessory_exercises(name) ON DELETE SET NULL,
                FOREIGN KEY (exercise_4) REFERENCES accessory_exercises(name) ON DELETE SET NULL,
                FOREIGN KEY (exercise_5) REFERENCES accessory_exercises(name) ON DELETE SET NULL,
                FOREIGN KEY (superset_1_1, superset_1_2) REFERENCES supersets(exercise_1, exercise_2) ON DELETE SET NULL,
                FOREIGN KEY (superset_2_1, superset_2_2) REFERENCES supersets(exercise_1, exercise_2) ON DELETE SET NULL
            );
        `);

        db.execSync(`
            CREATE TABLE IF NOT EXISTS programs (
                name TEXT PRIMARY KEY NOT NULL,
                Monday TEXT NULL,
                Tuesday TEXT NULL,
                Wednesday TEXT NULL,
                Thursday TEXT NULL,
                Friday TEXT NULL,
                Saturday TEXT NULL,
                Sunday TEXT NULL,
                FOREIGN KEY (Monday) REFERENCES days(name) ON DELETE SET NULL,
                FOREIGN KEY (Tuesday) REFERENCES days(name) ON DELETE SET NULL,
                FOREIGN KEY (Wednesday) REFERENCES days(name) ON DELETE SET NULL,
                FOREIGN KEY (Thursday) REFERENCES days(name) ON DELETE SET NULL,
                FOREIGN KEY (Friday) REFERENCES days(name) ON DELETE SET NULL,
                FOREIGN KEY (Saturday) REFERENCES days(name) ON DELETE SET NULL,
                FOREIGN KEY (Sunday) REFERENCES days(name) ON DELETE SET NULL
            );
        `);

        db.execSync(`
           CREATE TABLE IF NOT EXISTS current_program (
               id INTEGER PRIMARY KEY NOT NULL,
               program NULL,
               FOREIGN KEY (program) REFERENCES programs(name) ON DELETE SET NULL
           );
        `);

        db.execSync(`
            PRAGMA foreign_keys=on;
        `);
    }
    catch (err) {
        console.log('Error setting up database');
        console.log(err);
    }
}

const dbTeardown = (db) => {
    db.execSync(`
        DROP TABLE IF EXISTS primary_exercises;
        DROP TABLE IF EXISTS accessory_exercises;
        DROP TABLE IF EXISTS supersets;
        DROP TABLE IF EXISTS days;
        DROP TABLE IF EXISTS programs;
        DROP TABLE IF EXISTS current_program;
        DROP TRIGGER IF EXISTS clear_exercise_1_placement;
        DROP TRIGGER IF EXISTS clear_exercise_2_placement;
        DROP TRIGGER IF EXISTS clear_exercise_3_placement;
        DROP TRIGGER IF EXISTS clear_exercise_4_placement;
        DROP TRIGGER IF EXISTS clear_exercise_5_placement;
        DROP TRIGGER IF EXISTS clear_superset_1_placement;
        DROP TRIGGER IF EXISTS clear_superset_2_placement;
    `);
}

const addMockProgram = (db) => {
    try {
        const result = db.getFirstSync(`SELECT *
                                        FROM primary_exercises`);
        if (result != null) return;

        db.execSync(`
            INSERT INTO primary_exercises (name, rest, weight_1, weight_2, weight_3, reps_1, reps_2, reps_3)
            VALUES ('Bench', 210, 190, 215, 245, 5, 3, 1);
            INSERT INTO accessory_exercises (name, rest, weight, reps, sets)
            VALUES ('DB OHP', 90, 45, 12, 3);
            INSERT INTO accessory_exercises (name, rest, weight, reps, sets)
            VALUES ('Dips', 90, 0, 15, 3);
            INSERT INTO accessory_exercises (name, rest, weight, reps, sets)
            VALUES ('Lateral Raise', 90, 20, 15, 3);
            INSERT INTO accessory_exercises (name, rest, weight, reps, sets)
            VALUES ('Tricep Extension', 90, 30, 15, 3);
            INSERT INTO supersets (exercise_1, exercise_2)
            VALUES ('Lateral Raise', 'Tricep Extension');

            INSERT INTO primary_exercises (name, rest, weight_1, weight_2, weight_3, reps_1, reps_2, reps_3)
            VALUES ('Deadlift', 210, 325, 355, 405, 5, 3, 1);
            INSERT INTO accessory_exercises (name, rest, weight, reps, sets)
            VALUES ('BB Curl', 90, 45, 21, 3);
            INSERT INTO accessory_exercises (name, rest, weight, reps, sets)
            VALUES ('Lat Pull', 90, 130, 12, 3);
            INSERT INTO accessory_exercises (name, rest, weight, reps, sets)
            VALUES ('Hammer Curl', 90, 30, 12, 3);
            INSERT INTO accessory_exercises (name, rest, weight, reps, sets)
            VALUES ('Face Pull', 90, 30, 15, 3);
            INSERT INTO supersets (exercise_1, exercise_2)
            VALUES ('Hammer Curl', 'Face Pull');

            INSERT INTO primary_exercises (name, rest, weight_1, weight_2, weight_3, reps_1, reps_2, reps_3)
            VALUES ('OHP', 180, 110, 125, 135, 5, 3, 1);
            INSERT INTO accessory_exercises (name, rest, weight, reps, sets)
            VALUES ('BB Row', 180, 165, 5, 5);
            INSERT INTO accessory_exercises (name, rest, weight, reps, sets)
            VALUES ('DB Bench', 120, 65, 12, 4);
            INSERT INTO accessory_exercises (name, rest, weight, reps, sets)
            VALUES ('BTB Shrug', 90, 40, 12, 3);
            INSERT INTO supersets (exercise_1, exercise_2)
            VALUES ('Lateral Raise', 'BTB Shrug');

            INSERT INTO accessory_exercises (name, rest, weight, reps, sets)
            VALUES ('Pause Squat', 180, 185, 5, 5);
            INSERT INTO accessory_exercises (name, rest, weight, reps, sets)
            VALUES ('Hamstring Curl', 90, 100, 12, 3);
            INSERT INTO accessory_exercises (name, rest, weight, reps, sets)
            VALUES ('Leg Extension', 90, 120, 12, 3);
            INSERT INTO accessory_exercises (name, rest, weight, reps, sets)
            VALUES ('DB Curl', 90, 35, 12, 3);
            INSERT INTO supersets (exercise_1, exercise_2)
            VALUES ('Hamstring Curl', 'Dips');
            INSERT INTO supersets (exercise_1, exercise_2)
            VALUES ('Leg Extension', 'DB Curl');
        `);

        db.execSync(`
            INSERT INTO days (name, color, exercise_1, exercise_1_placement, exercise_2, exercise_2_placement,
                              exercise_3, exercise_3_placement, superset_1_1, superset_1_2, superset_1_placement)
            VALUES ('Push', 'red', 'Bench', 1, 'DB OHP', 2, 'Dips', 3, 'Lateral Raise', 'Tricep Extension', 4);

            INSERT INTO days (name, color, exercise_1, exercise_1_placement, exercise_2, exercise_2_placement,
                              exercise_3, exercise_3_placement, superset_1_1, superset_1_2, superset_1_placement)
            VALUES ('Pull', 'blue', 'Deadlift', 1, 'BB Curl', 2, 'Lat Pull', 3, 'Hammer Curl', 'Face Pull', 4);

            INSERT INTO days (name, color, exercise_1, exercise_1_placement, exercise_2, exercise_2_placement,
                              exercise_3, exercise_3_placement, superset_1_1, superset_1_2, superset_1_placement)
            VALUES ('Upper', 'purple', 'OHP', 1, 'BB Row', 2, 'DB Bench', 3, 'Lateral Raise', 'BTB Shrug', 4);

            INSERT INTO days (name, color, exercise_2, exercise_2_placement, superset_1_1, superset_1_2,
                              superset_1_placement, superset_2_1, superset_2_2, superset_2_placement)
            VALUES ('Lower & Arms', 'green', 'Pause Squat', 1, 'Hamstring Curl', 'Dips', 2, 'Leg Extension', 'DB Curl', 3);
        `);

        db.execSync(`
            INSERT INTO programs (name, Monday, Tuesday, Wednesday, Thursday, Friday, Saturday, Sunday)
            VALUES ('PPUL', 'Pull', NULL, 'Upper', 'Lower & Arms', NULL, NULL, 'Push');
            INSERT INTO programs (name, Monday)
            VALUES ('Test0', 'Pull');
            INSERT INTO programs (name, Monday)
            VALUES ('Test1', 'Upper');
            INSERT INTO programs (name, Monday)
            VALUES ('Test2', 'Lower & Arms');
            INSERT INTO programs (name, Monday)
            VALUES ('Test3', 'Pull');
            INSERT INTO programs (name, Monday)
            VALUES ('Test4', 'Upper');
            INSERT INTO programs (name, Monday)
            VALUES ('Test5', 'Lower & Arms');
            INSERT INTO programs (name, Monday)
            VALUES ('Test6', 'Pull');
            INSERT INTO programs (name, Monday)
            VALUES ('Test7', 'Upper');
            INSERT INTO programs (name, Monday)
            VALUES ('Test8', 'Lower & Arms');
        `);

        db.execSync(`
            INSERT INTO current_program (program)
            VALUES ('PPUL');
        `);
    }
    catch (err) {
        console.log('Error adding mock program');
        console.log(err);
    }
}

const getProgram = (db) => {
    const res: programType = {
        name: '',
        days: []
    }

    // Check if table exists
    const result = db.getFirstSync(`SELECT name FROM sqlite_master WHERE type='table' AND name='current_program'`);
    if (result == null) return null;

    // Get the current program
    const currentProgram = db.getFirstSync(`SELECT program FROM current_program`);
    if (currentProgram == null) return null;

    const program = db.getFirstSync(`SELECT * FROM programs WHERE name = '${currentProgram.program}'`);
    if (program == null) return null;
    res.name = program.name;

    // Get the days for the program
    for (const dayOfWeek of ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']) {
        const day = db.getFirstSync(`SELECT * FROM days WHERE name = '${program[dayOfWeek]}'`);
        if (day == null) continue;
        const dayRes: dayType = {
            name: day.name,
            color: day.color,
            exercises: [],
        }
        const exerciseRes = Array(7).fill(null);

        // Get the primary exercise
        const primaryExercise = db.getFirstSync(`SELECT * FROM primary_exercises WHERE name = '${day.exercise_1}'`);
        if (primaryExercise != null) {
            const primaryExerciseRes: primaryExerciseType = {
                name: primaryExercise.name,
                rest: primaryExercise.rest,
                weight_1: primaryExercise.weight_1,
                weight_2: primaryExercise.weight_2,
                weight_3: primaryExercise.weight_3,
                reps_1: primaryExercise.reps_1,
                reps_2: primaryExercise.reps_2,
                reps_3: primaryExercise.reps_3
            }
            exerciseRes[day.exercise_1_placement - 1] = primaryExerciseRes;
        }

        // Get the accessory exercises
        for (let i = 2; i < 6; i++) {
            if (day[`exercise_${i}`] != null) {
                const accessoryExercise = db.getFirstSync(`SELECT * FROM accessory_exercises WHERE name = '${day[`exercise_${i}`]}'`);
                const accessoryExerciseRes : accessoryExerciseType = {
                    name: accessoryExercise.name,
                    rest: accessoryExercise.rest,
                    sets: accessoryExercise.sets,
                    reps: accessoryExercise.reps,
                    weight: accessoryExercise.weight
                };
                const placementIndex = day[`exercise_${i}_placement`] - 1;
                exerciseRes[placementIndex] = accessoryExerciseRes;
            }
        }

        // Get the superset exercises
        for (let i = 1; i < 3; i++) {
            if (day[`superset_${i}_1`] != null) {
                const exercise1 = db.getFirstSync(`SELECT * FROM accessory_exercises WHERE name = '${day[`superset_${i}_1`]}'`);
                const exercise2 = db.getFirstSync(`SELECT * FROM accessory_exercises WHERE name = '${day[`superset_${i}_2`]}'`);
                if (exercise1 == null) continue;
                const superSetRes : superSetType = {
                    exercise1: {
                        name: exercise1.name,
                        rest: exercise1.rest,
                        sets: exercise1.sets,
                        reps: exercise1.reps,
                        weight: exercise1.weight
                    },
                    exercise2: {
                        name: exercise2.name,
                        rest: exercise2.rest,
                        sets: exercise2.sets,
                        reps: exercise2.reps,
                        weight: exercise2.weight
                    }
                }
                const placementIndex = day[`superset_${i}_placement`] - 1;
                exerciseRes[placementIndex] = superSetRes;
            }
        }
        dayRes.exercises = exerciseRes.filter((exercise) => exercise != null);
        res.days.push(dayRes);
    }

    return res;
}

export {dbSetup, dbTeardown, addMockProgram, getProgram};