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
                sets INTEGER NOT NULL,
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
                FOREIGN KEY (exercise_1) REFERENCES accessory_exercises(name),
                FOREIGN KEY (exercise_2) REFERENCES accessory_exercises(name)
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
                FOREIGN KEY (exercise_1) REFERENCES primary_exercises(name),
                FOREIGN KEY (exercise_2) REFERENCES accessory_exercises(name),
                FOREIGN KEY (exercise_3) REFERENCES accessory_exercises(name),
                FOREIGN KEY (exercise_4) REFERENCES accessory_exercises(name),
                FOREIGN KEY (exercise_5) REFERENCES accessory_exercises(name),
                FOREIGN KEY (superset_1_1, superset_1_2) REFERENCES supersets(exercise_1, exercise_2),
                FOREIGN KEY (superset_2_1, superset_2_2) REFERENCES supersets(exercise_1, exercise_2)
            );
        `);

        db.execSync(`
            CREATE TABLE IF NOT EXISTS programs (
                name TEXT PRIMARY KEY NOT NULL,
                monday TEXT NULL,
                tuesday TEXT NULL,
                wednesday TEXT NULL,
                thursday TEXT NULL,
                friday TEXT NULL,
                saturday TEXT NULL,
                sunday TEXT NULL,
                FOREIGN KEY (monday) REFERENCES days(name),
                FOREIGN KEY (tuesday) REFERENCES days(name),
                FOREIGN KEY (wednesday) REFERENCES days(name),
                FOREIGN KEY (thursday) REFERENCES days(name),
                FOREIGN KEY (friday) REFERENCES days(name),
                FOREIGN KEY (saturday) REFERENCES days(name),
                FOREIGN KEY (sunday) REFERENCES days(name)
            );
        `);

        db.execSync(`
           CREATE TABLE IF NOT EXISTS current_program (
               id INTEGER PRIMARY KEY NOT NULL,
               program TEXT NOT NULL,
               FOREIGN KEY (program) REFERENCES programs(name)
           );
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
    `);
}

const addMockProgram = (db) => {
    try {
        const result = db.getFirstSync(`SELECT *
                                        FROM primary_exercises`);
        if (result != null) return;

        db.execSync(`
            INSERT INTO primary_exercises (name, rest, sets, weight_1, weight_2, weight_3, reps_1, reps_2, reps_3)
            VALUES ('Bench', 210, 5, 190, 215, 245, 5, 3, 1);
            INSERT INTO accessory_exercises (name, rest, weight, reps, sets)
            VALUES ('DB OHP', 90, 45, 12, 3);
            INSERT INTO accessory_exercises (name, rest, weight, reps, sets)
            VALUES ('Dips', 90, 0, 12, 3);
            INSERT INTO accessory_exercises (name, rest, weight, reps, sets)
            VALUES ('Incline Bench', 90, 50, 12, 3);
            INSERT INTO accessory_exercises (name, rest, weight, reps, sets)
            VALUES ('Lateral Raise', 90, 20, 15, 3);
            INSERT INTO accessory_exercises (name, rest, weight, reps, sets)
            VALUES ('Tricep Extension', 90, 35, 15, 3);
            INSERT INTO supersets (exercise_1, exercise_2)
            VALUES ('Lateral Raise', 'Tricep Extension');
        `);

        db.execSync(`
            INSERT INTO days (name, color, exercise_1, exercise_1_placement, exercise_2, exercise_2_placement,
                              exercise_3, exercise_3_placement, exercise_4, exercise_4_placement, superset_1_1,
                              superset_1_2, superset_1_placement)
            VALUES ('Push', 'red', 'Bench', 1, 'DB OHP', 2, 'Dips', 3, 'Incline Bench', 5, 'Lateral Raise',
                    'Tricep Extension', 4);
        `);

        db.execSync(`
            INSERT INTO programs (name, monday, tuesday, wednesday, thursday, friday, saturday, sunday)
            VALUES ('PPUL', 'Push', NULL, NULL, NULL, NULL, NULL, NULL);
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
    for (const dayOfWeek of ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']) {
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
        const primaryExerciseRes: primaryExerciseType = {
            name: primaryExercise.name,
            rest: primaryExercise.rest,
            sets: primaryExercise.sets,
            weight_1: primaryExercise.weight_1,
            weight_2: primaryExercise.weight_2,
            weight_3: primaryExercise.weight_3,
            reps_1: primaryExercise.reps_1,
            reps_2: primaryExercise.reps_2,
            reps_3: primaryExercise.reps_3
        }
        exerciseRes[day.exercise_1_placement-1] = primaryExerciseRes;

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
                console.log('placement', placementIndex);
                exerciseRes[placementIndex] = superSetRes;
            }
        }
        dayRes.exercises = exerciseRes.filter((exercise) => exercise != null);
        console.log(dayRes.exercises);
        res.days.push(dayRes);
    }

    return res;
}

export {dbSetup, dbTeardown, addMockProgram, getProgram};