import {programType, dayType, primaryExerciseType, accessoryExerciseType} from "@/types/programType";

const dbSetup = (db) => {
    try {
        db.execSync(`
            CREATE TABLE IF NOT EXISTS accessory_exercises (
                id INTEGER PRIMARY KEY NOT NULL,
                name TEXT NOT NULL,
                rest INTEGER NOT NULL,
                sets INTEGER NOT NULL,
                weight INTEGER NOT NULL,
                reps INTEGER NOT NULL
            );
        `);

        db.execSync(`
            CREATE TABLE IF NOT EXISTS primary_exercises (
                id INTEGER PRIMARY KEY NOT NULL,
                name TEXT NOT NULL,
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
                id INTEGER PRIMARY KEY NOT NULL,
                exercise_1 INTEGER NOT NULL,
                exercise_2 INTEGER NOT NULL,
                FOREIGN KEY (exercise_1) REFERENCES accessory_exercises(id),
                FOREIGN KEY (exercise_2) REFERENCES accessory_exercises(id)
            );
        `);

        db.execSync(`
            CREATE TABLE IF NOT EXISTS days (
                id INTEGER PRIMARY KEY NOT NULL,
                name TEXT NOT NULL,
                color TEXT NOT NULL,
                exercise_1 INTEGER NULL,
                exercise_2 INTEGER NULL,
                exercise_3 INTEGER NULL,
                exercise_4 INTEGER NULL,
                exercise_5 INTEGER NULL,
                superset_1 INTEGER NULL,
                superset_1_placement INTEGER NULL,
                superset_2 INTEGER NULL,
                superset_2_placement INTEGER NULL,
                FOREIGN KEY (exercise_1) REFERENCES primary_exercises(id),
                FOREIGN KEY (exercise_2) REFERENCES accessory_exercises(id),
                FOREIGN KEY (exercise_3) REFERENCES accessory_exercises(id),
                FOREIGN KEY (exercise_4) REFERENCES accessory_exercises(id),
                FOREIGN KEY (exercise_5) REFERENCES accessory_exercises(id),
                FOREIGN KEY (superset_1) REFERENCES supersets(id),
                FOREIGN KEY (superset_2) REFERENCES supersets(id)
            );
        `);

        db.execSync(`
            CREATE TABLE IF NOT EXISTS programs (
                id INTEGER PRIMARY KEY NOT NULL,
                name TEXT NOT NULL,
                monday INTEGER NULL,
                tuesday INTEGER NULL,
                wednesday INTEGER NULL,
                thursday INTEGER NULL,
                friday INTEGER NULL,
                saturday INTEGER NULL,
                sunday INTEGER NULL,
                FOREIGN KEY (monday) REFERENCES days(id),
                FOREIGN KEY (tuesday) REFERENCES days(id),
                FOREIGN KEY (wednesday) REFERENCES days(id),
                FOREIGN KEY (thursday) REFERENCES days(id),
                FOREIGN KEY (friday) REFERENCES days(id),
                FOREIGN KEY (saturday) REFERENCES days(id),
                FOREIGN KEY (sunday) REFERENCES days(id)
            );
        `);

        db.execSync(`
           CREATE TABLE IF NOT EXISTS current_program (
               id INTEGER PRIMARY KEY NOT NULL,
               program INTEGER NOT NULL,
               FOREIGN KEY (program) REFERENCES programs(id)
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
    const result = db.getFirstSync(`SELECT * FROM primary_exercises`);
    if (result != null) return;

    db.execSync(`
        INSERT INTO primary_exercises (name, rest, sets, weight_1, weight_2, weight_3, reps_1, reps_2, reps_3) VALUES ('Bench', 210, 5, 190, 215, 245, 5, 3, 1);
        INSERT INTO accessory_exercises (name, rest, weight, reps, sets) VALUES ('DB OHP', 90, 45, 12, 3);
        INSERT INTO accessory_exercises (name, rest, weight, reps, sets) VALUES ('Dips', 90, 0, 12, 3);
        INSERT INTO accessory_exercises (name, rest, weight, reps, sets) VALUES ('Incline Bench', 90, 50, 12, 3);
        INSERT INTO accessory_exercises (name, rest, weight, reps, sets) VALUES ('Lateral Raise', 90, 20, 15, 3);
        INSERT INTO accessory_exercises (name, rest, weight, reps, sets) VALUES ('Tricep Extension', 90, 35, 15, 3);
        INSERT INTO supersets (exercise_1, exercise_2) VALUES (4, 5);
    `);

    db.execSync(`
        INSERT INTO days (name, color, exercise_1, exercise_2, exercise_3, exercise_4, exercise_5, superset_1, superset_1_placement, superset_2, superset_2_placement) VALUES ('Push', 'red', 1, 1, 2, 3, NULL, 1, 4, NULL, NULL);
    `);

    db.execSync(`
        INSERT INTO programs (name, monday, tuesday, wednesday, thursday, friday, saturday, sunday) VALUES ('PPUL', 1, NULL, NULL, NULL, NULL, NULL, NULL);
    `);

    db.execSync(`
        INSERT INTO current_program (program) VALUES (1);
    `);
}

const getProgram = (db) => {
    const res: programType = {
        name: '',
        days: []
    }

    // Get the current program
    const currentProgram = db.getFirstSync(`SELECT program FROM current_program`);
    if (currentProgram == null) return null;

    const program = db.getFirstSync(`SELECT * FROM programs WHERE id = ${currentProgram.program}`);
    if (program == null) return null;
    res.name = program.name;

    // Get the days for the program
    for (const dayOfWeek of ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']) {
        let day = db.getFirstSync(`SELECT * FROM days WHERE id = ${program[dayOfWeek]}`);
        if (day == null) {
            res.days.push(null);
            continue;
        }
        const dayRes: dayType = {
            name: day.name,
            color: day.color,
            primaryExercise: {
                name: '',
                rest: 0,
                sets: 0,
                weight_1: 0,
                weight_2: 0,
                weight_3: 0,
                reps_1: 0,
                reps_2: 0,
                reps_3: 0
            },
            accessoryExercises: [],
            supersetExercises: []
        }

        // Get the primary exercise
        let primaryExercise = db.getFirstSync(`SELECT * FROM primary_exercises WHERE id = ${day.exercise_1}`);
        dayRes.primaryExercise.name = primaryExercise.name;
        dayRes.primaryExercise.rest = primaryExercise.rest;
        dayRes.primaryExercise.sets = primaryExercise.sets;
        dayRes.primaryExercise.weight_1 = primaryExercise.weight_1;
        dayRes.primaryExercise.weight_2 = primaryExercise.weight_2;
        dayRes.primaryExercise.weight_3 = primaryExercise.weight_3;
        dayRes.primaryExercise.reps_1 = primaryExercise.reps_1;
        dayRes.primaryExercise.reps_2 = primaryExercise.reps_2;
        dayRes.primaryExercise.reps_3 = primaryExercise.reps_3;

        // Get the accessory exercises
        for (let i = 2; i < 6; i++) {
            if (day[`exercise_${i}`] != null) {
                let accessoryExercise = db.getFirstSync(`SELECT * FROM accessory_exercises WHERE id = ${day[`exercise_${i}`]}`);
                const accessoryExerciseRes: accessoryExerciseType = {
                    name: accessoryExercise.name,
                    rest: accessoryExercise.rest,
                    sets: accessoryExercise.sets,
                    reps: accessoryExercise.reps,
                    weight: accessoryExercise.weight
                }
                dayRes.accessoryExercises.push(accessoryExerciseRes);
            }
        }

        // Get the superset exercises
        for (let i = 1; i < 3; i++) {
            if (day[`superset_${i}`] != null) {
                let superSet = db.getFirstSync(`SELECT * FROM supersets WHERE id = ${day[`superset_${i}`]}`);
                let exercise1 = db.getFirstSync(`SELECT * FROM accessory_exercises WHERE id = ${superSet.exercise_1}`);
                let exercise2 = db.getFirstSync(`SELECT * FROM accessory_exercises WHERE id = ${superSet.exercise_2}`);
                const superSetRes = {
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
                    },
                    placement: superSet.placement
                }
                dayRes.supersetExercises.push(superSetRes);
            }
        }
        res.days.push(dayRes);
    }

    return res;
}

export {dbSetup, dbTeardown, addMockProgram, getProgram};