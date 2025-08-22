import {setType, exerciseType, superSetType, dayType, programType} from "@/types/programType";
import * as SQLite from "expo-sqlite";

const dbSetup = (db:  SQLite.SQLiteDatabase) => {
    try {
        db.execSync(`
            CREATE TABLE IF NOT EXISTS exercises (
                name TEXT PRIMARY KEY NOT NULL
            );
        `);

        db.execSync(`
            CREATE TABLE IF NOT EXISTS exercise_details (
                name TEXT NOT NULL,
                set_index INTEGER NOT NULL,
                rest INTEGER NOT NULL,
                weight INTEGER NOT NULL,
                reps INTEGER NOT NULL,
                PRIMARY KEY (name, set_index),
                FOREIGN KEY (name) REFERENCES exercises(name) ON DELETE CASCADE
            );
        `);

        db.execSync(`
            CREATE TABLE IF NOT EXISTS supersets (
                exercise_1 TEXT NOT NULL,
                exercise_2 TEXT NOT NULL,
                PRIMARY KEY (exercise_1, exercise_2),
                FOREIGN KEY (exercise_1) REFERENCES exercises(name) ON DELETE CASCADE,
                FOREIGN KEY (exercise_2) REFERENCES exercises(name) ON DELETE CASCADE
            );
        `);

        db.execSync(`
            CREATE TABLE IF NOT EXISTS days (
                name TEXT PRIMARY KEY NOT NULL,
                color TEXT NOT NULL,
            );
        `);

        db.execSync(`
            CREATE TABLE IF NOT EXISTS day_details (
                name TEXT NOT NULL,
                exercise_index INTEGER NOT NULL,
                exercise TEXT NULL,
                superset TEXT NULL,
                PRIMARY KEY (name, exercise_index),
                FOREIGN KEY (name) REFERENCES days(name) ON DELETE CASCADE,
                FOREIGN KEY (exercise) REFERENCES exercises(name) ON DELETE SET NULL,
                FOREIGN KEY (superset) REFERENCES supersets(exercise_1, exercise_2) ON DELETE SET NULL
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

const dbTeardown = (db:  SQLite.SQLiteDatabase) => {
    db.execSync(`
        DROP TABLE IF EXISTS exercises;
        DROP TABLE IF EXISTS exercise_details;
        DROP TABLE IF EXISTS supersets;
        DROP TABLE IF EXISTS days;
        DROP TABLE IF EXISTS day_details;
        DROP TABLE IF EXISTS programs;
        DROP TABLE IF EXISTS current_program;
    `);
}

const addMockProgram = (db:  SQLite.SQLiteDatabase) => {
    try {
        const result = db.getFirstSync(`SELECT * FROM exercises`);
        if (result != null) return;

        db.execSync(`
            INSERT INTO exercises (name) VALUES ('Bench');
            INSERT INTO exercises (name) VALUES ('Squat');
            INSERT INTO exercises (name) VALUES ('DB OHP');
            INSERT INTO exercises (name) VALUES ('Dips');
            INSERT INTO exercises (name) VALUES ('Lateral Raise');
            INSERT INTO exercises (name) VALUES ('Tricep Extension');
            INSERT INTO exercises (name) VALUES ('Leg Raises');
            INSERT INTO exercises (name) VALUES ('Deadlift');
            INSERT INTO exercises (name) VALUES ('BB Curl');
            INSERT INTO exercises (name) VALUES ('Lat Pull');
            INSERT INTO exercises (name) VALUES ('Hammer Curl');
            INSERT INTO exercises (name) VALUES ('Face Pull');
            INSERT INTO exercises (name) VALUES ('Cable Crunches');
            INSERT INTO exercises (name) VALUES ('OHP');
            INSERT INTO exercises (name) VALUES ('BB Row');
            INSERT INTO exercises (name) VALUES ('DB Bench');
            INSERT INTO exercises (name) VALUES ('BTB Shrug');
            INSERT INTO exercises (name) VALUES ('Hamstring Curl');
            INSERT INTO exercises (name) VALUES ('Leg Extension');
            INSERT INTO exercises (name) VALUES ('DB Curl');
        `);

        db.execSync(`
            -- Bench Press sets
            INSERT INTO exercise_details (name, set_index, rest, weight, reps) VALUES ('Bench', 1, 210, 205, 5);
            INSERT INTO exercise_details (name, set_index, rest, weight, reps) VALUES ('Bench', 2, 210, 235, 3);
            INSERT INTO exercise_details (name, set_index, rest, weight, reps) VALUES ('Bench', 3, 210, 260, 1);

            -- Squat sets
            INSERT INTO exercise_details (name, set_index, rest, weight, reps) VALUES ('Squat', 1, 210, 225, 5);
            INSERT INTO exercise_details (name, set_index, rest, weight, reps) VALUES ('Squat', 2, 210, 245, 3);
            INSERT INTO exercise_details (name, set_index, rest, weight, reps) VALUES ('Squat', 3, 210, 275, 1);
            
            -- Deadlift sets
            INSERT INTO exercise_details (name, set_index, rest, weight, reps) VALUES ('Deadlift', 1, 210, 325, 5);
            INSERT INTO exercise_details (name, set_index, rest, weight, reps) VALUES ('Deadlift', 2, 210, 365, 3);
            INSERT INTO exercise_details (name, set_index, rest, weight, reps) VALUES ('Deadlift', 3, 210, 425, 1);
            
            -- OHP sets
            INSERT INTO exercise_details (name, set_index, rest, weight, reps) VALUES ('OHP', 1, 180, 115, 5);
            INSERT INTO exercise_details (name, set_index, rest, weight, reps) VALUES ('OHP', 2, 180, 140, 3);
            INSERT INTO exercise_details (name, set_index, rest, weight, reps) VALUES ('OHP', 3, 180, 150, 1);
            
            -- BB Row sets
            INSERT INTO exercise_details (name, set_index, rest, weight, reps) VALUES ('BB Row', 1, 180, 165, 5);
            INSERT INTO exercise_details (name, set_index, rest, weight, reps) VALUES ('BB Row', 2, 180, 185, 3);
            INSERT INTO exercise_details (name, set_index, rest, weight, reps) VALUES ('BB Row', 3, 180, 185, 3);
        `);

        db.execSync(`
            -- DB OHP sets
            INSERT INTO exercise_details (name, set_index, rest, weight, reps) VALUES ('DB OHP', 1, 90, 45, 12);
            INSERT INTO exercise_details (name, set_index, rest, weight, reps) VALUES ('DB OHP', 2, 90, 45, 12);
            INSERT INTO exercise_details (name, set_index, rest, weight, reps) VALUES ('DB OHP', 3, 90, 45, 12);
            
            -- Dips sets
            INSERT INTO exercise_details (name, set_index, rest, weight, reps) VALUES ('Dips', 1, 90, 0, 15);
            INSERT INTO exercise_details (name, set_index, rest, weight, reps) VALUES ('Dips', 2, 90, 0, 15);
            INSERT INTO exercise_details (name, set_index, rest, weight, reps) VALUES ('Dips', 3, 90, 0, 15);
            
            -- Lateral Raise sets
            INSERT INTO exercise_details (name, set_index, rest, weight, reps) VALUES ('Lateral Raise', 1, 90, 25, 15);
            INSERT INTO exercise_details (name, set_index, rest, weight, reps) VALUES ('Lateral Raise', 2, 90, 25, 15);
            INSERT INTO exercise_details (name, set_index, rest, weight, reps) VALUES ('Lateral Raise', 3, 90, 25, 15);
            
            -- Tricep Extension sets
            INSERT INTO exercise_details (name, set_index, rest, weight, reps) VALUES ('Tricep Extension', 1, 90, 30, 15);
            INSERT INTO exercise_details (name, set_index, rest, weight, reps) VALUES ('Tricep Extension', 2, 90, 30, 15);
            INSERT INTO exercise_details (name, set_index, rest, weight, reps) VALUES ('Tricep Extension', 3, 90, 30, 15);
            
            -- Leg Raises sets
            INSERT INTO exercise_details (name, set_index, rest, weight, reps) VALUES ('Leg Raises', 1, 90, 0, 15);
            INSERT INTO exercise_details (name, set_index, rest, weight, reps) VALUES ('Leg Raises', 2, 90, 0, 15);
            INSERT INTO exercise_details (name, set_index, rest, weight, reps) VALUES ('Leg Raises', 3, 90, 0, 15);
            INSERT INTO exercise_details (name, set_index, rest, weight, reps) VALUES ('Leg Raises', 4, 90, 0, 15);
            
            -- BB Curl sets
            INSERT INTO exercise_details (name, set_index, rest, weight, reps) VALUES ('BB Curl', 1, 90, 45, 21);
            INSERT INTO exercise_details (name, set_index, rest, weight, reps) VALUES ('BB Curl', 2, 90, 45, 21);
            INSERT INTO exercise_details (name, set_index, rest, weight, reps) VALUES ('BB Curl', 3, 90, 45, 21);
            
            -- Lat Pull sets
            INSERT INTO exercise_details (name, set_index, rest, weight, reps) VALUES ('Lat Pull', 1, 90, 143, 12);
            INSERT INTO exercise_details (name, set_index, rest, weight, reps) VALUES ('Lat Pull', 2, 90, 143, 12);
            INSERT INTO exercise_details (name, set_index, rest, weight, reps) VALUES ('Lat Pull', 3, 90, 143, 12);
            
            -- Hammer Curl sets
            INSERT INTO exercise_details (name, set_index, rest, weight, reps) VALUES ('Hammer Curl', 1, 90, 30, 12);
            INSERT INTO exercise_details (name, set_index, rest, weight, reps) VALUES ('Hammer Curl', 2, 90, 30, 12);
            INSERT INTO exercise_details (name, set_index, rest, weight, reps) VALUES ('Hammer Curl', 3, 90, 30, 12);
            
            -- Face Pull sets
            INSERT INTO exercise_details (name, set_index, rest, weight, reps) VALUES ('Face Pull', 1, 90, 20, 15);
            INSERT INTO exercise_details (name, set_index, rest, weight, reps) VALUES ('Face Pull', 2, 90, 20, 15);
            INSERT INTO exercise_details (name, set_index, rest, weight, reps) VALUES ('Face Pull', 3, 90, 20, 15);
            
            -- Cable Crunches sets
            INSERT INTO exercise_details (name, set_index, rest, weight, reps) VALUES ('Cable Crunches', 1, 90, 60, 15);
            INSERT INTO exercise_details (name, set_index, rest, weight, reps) VALUES ('Cable Crunches', 2, 90, 60, 15);
            INSERT INTO exercise_details (name, set_index, rest, weight, reps) VALUES ('Cable Crunches', 3, 90, 60, 15);
            INSERT INTO exercise_details (name, set_index, rest, weight, reps) VALUES ('Cable Crunches', 4, 90, 60, 15);
            
            -- DB Bench sets
            INSERT INTO exercise_details (name, set_index, rest, weight, reps) VALUES ('DB Bench', 1, 120, 65, 12);
            INSERT INTO exercise_details (name, set_index, rest, weight, reps) VALUES ('DB Bench', 2, 120, 65, 12);
            INSERT INTO exercise_details (name, set_index, rest, weight, reps) VALUES ('DB Bench', 3, 120, 65, 12);
            INSERT INTO exercise_details (name, set_index, rest, weight, reps) VALUES ('DB Bench', 4, 120, 65, 12);
            
            -- BTB Shrug sets
            INSERT INTO exercise_details (name, set_index, rest, weight, reps) VALUES ('BTB Shrug', 1, 90, 50, 12);
            INSERT INTO exercise_details (name, set_index, rest, weight, reps) VALUES ('BTB Shrug', 2, 90, 50, 12);
            INSERT INTO exercise_details (name, set_index, rest, weight, reps) VALUES ('BTB Shrug', 3, 90, 50, 12);
            
            -- Hamstring Curl sets
            INSERT INTO exercise_details (name, set_index, rest, weight, reps) VALUES ('Hamstring Curl', 1, 90, 100, 12);
            INSERT INTO exercise_details (name, set_index, rest, weight, reps) VALUES ('Hamstring Curl', 2, 90, 100, 12);
            INSERT INTO exercise_details (name, set_index, rest, weight, reps) VALUES ('Hamstring Curl', 3, 90, 100, 12);
            
            -- Leg Extension sets
            INSERT INTO exercise_details (name, set_index, rest, weight, reps) VALUES ('Leg Extension', 1, 90, 120, 12);
            INSERT INTO exercise_details (name, set_index, rest, weight, reps) VALUES ('Leg Extension', 2, 90, 120, 12);
            INSERT INTO exercise_details (name, set_index, rest, weight, reps) VALUES ('Leg Extension', 3, 90, 120, 12);
            
            -- DB Curl sets
            INSERT INTO exercise_details (name, set_index, rest, weight, reps) VALUES ('DB Curl', 1, 90, 30, 12);
            INSERT INTO exercise_details (name, set_index, rest, weight, reps) VALUES ('DB Curl', 2, 90, 30, 12);
            INSERT INTO exercise_details (name, set_index, rest, weight, reps) VALUES ('DB Curl', 3, 90, 30, 12);
        `);

        db.execSync(`
            INSERT INTO supersets (exercise_1, exercise_2) VALUES ('Lateral Raise', 'Tricep Extension');
            INSERT INTO supersets (exercise_1, exercise_2) VALUES ('Hammer Curl', 'Face Pull');
            INSERT INTO supersets (exercise_1, exercise_2) VALUES ('Lateral Raise', 'BTB Shrug');
            INSERT INTO supersets (exercise_1, exercise_2) VALUES ('Hamstring Curl', 'Dips');
            INSERT INTO supersets (exercise_1, exercise_2) VALUES ('Leg Extension', 'DB Curl');
        `);

        db.execSync(`
            INSERT INTO days (name, color) VALUES ('Push', 'red');
            INSERT INTO days (name, color) VALUES ('Pull', 'blue');
            INSERT INTO days (name, color) VALUES ('Upper', 'purple');
            INSERT INTO days (name, color) VALUES ('Lower & Arms', 'green');
        `);

        // Insert day details for mock program
        db.execSync(`
            INSERT INTO day_details (name, exercise_index, exercise, superset) VALUES ('Push', 1, 'Bench', NULL);
            INSERT INTO day_details (name, exercise_index, exercise, superset) VALUES ('Push', 2, 'DB OHP', NULL);
            INSERT INTO day_details (name, exercise_index, exercise, superset) VALUES ('Push', 3, 'Dips', NULL);
            INSERT INTO day_details (name, exercise_index, exercise, superset) VALUES ('Push', 4, NULL, 'Lateral Raise, Tricep Extension');
            INSERT INTO day_details (name, exercise_index, exercise, superset) VALUES ('Push', 5, 'Leg Raises', NULL);
        `);

        db.execSync(`
            INSERT INTO day_details (name, exercise_index, exercise, superset) VALUES ('Pull', 1, 'Deadlift', NULL);
            INSERT INTO day_details (name, exercise_index, exercise, superset) VALUES ('Pull', 2, 'BB Curl', NULL);
            INSERT INTO day_details (name, exercise_index, exercise, superset) VALUES ('Pull', 3, 'Lat Pull', NULL);
            INSERT INTO day_details (name, exercise_index, exercise, superset) VALUES ('Pull', 4, NULL, 'Hammer Curl,Face Pull');
            INSERT INTO day_details (name, exercise_index, exercise, superset) VALUES ('Pull', 5, 'Cable Crunches', NULL);
        `);

        db.execSync(`
            INSERT INTO day_details (name, exercise_index, exercise, superset) VALUES ('Upper', 1, 'OHP', NULL);
            INSERT INTO day_details (name, exercise_index, exercise, superset) VALUES ('Upper', 2, 'BB Row', NULL);
            INSERT INTO day_details (name, exercise_index, exercise, superset) VALUES ('Upper', 3, 'DB Bench', NULL);
            INSERT INTO day_details (name, exercise_index, exercise, superset) VALUES ('Upper', 4, NULL, 'Lateral Raise, BTB Shrug');
            INSERT INTO day_details (name, exercise_index, exercise, superset) VALUES ('Upper', 5, 'Leg Raises', NULL);
        `);

        db.execSync(`
            INSERT INTO day_details (name, exercise_index, exercise, superset) VALUES ('Lower & Arms', 1, 'Squat', NULL);
            INSERT INTO day_details (name, exercise_index, exercise, superset) VALUES ('Lower & Arms', 2, NULL, 'Hamstring Curl, Dips');
            INSERT INTO day_details (name, exercise_index, exercise, superset) VALUES ('Lower & Arms', 3, NULL, 'Leg Extension, DB Curl');
            INSERT INTO day_details (name, exercise_index, exercise, superset) VALUES ('Lower & Arms', 4, 'Cable Crunches', NULL);
        `);

        db.execSync(`
            INSERT INTO programs (name, Monday, Tuesday, Wednesday, Thursday, Friday, Saturday, Sunday)
            VALUES ('PPUL', 'Pull', NULL, 'Upper', 'Lower & Arms', NULL, NULL, 'Push');
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

const getProgram = (db:  SQLite.SQLiteDatabase) => {
    const res: programType = {
        name: '',
        days: []
    }

    // Check if table exists
    const result = db.getFirstSync(`SELECT name FROM sqlite_master WHERE type='table' AND name='current_program'`);
    if (result == null) return null;

    // Get the current program
    const currentProgram = db.getFirstSync(`SELECT program FROM current_program`) as any;
    if (currentProgram == null) return null;

    const program = db.getFirstSync(`SELECT * FROM programs WHERE name = '${currentProgram.program}'`) as any;
    if (program == null) return null;
    res.name = program.name;

    // Get the days for the program
    for (const dayOfWeek of ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']) {
        const dayName = program[dayOfWeek];
        if (dayName == null) continue;
        
        const day = db.getFirstSync(`SELECT * FROM days WHERE name = '${dayName}'`) as any;
        if (day == null) continue;
        
        const dayRes: dayType = {
            name: day.name,
            color: day.color,
            exercises: [],
        }

        // Get the details for the day
        const details = db.getAllSync(`SELECT * FROM day_details WHERE name = '${dayName}' ORDER BY exercise_index`) as any[];

        for (const detail of details) {
            if (detail.exercise != null) {
                const exerciseSets = db.getAllSync(`SELECT * FROM exercise_details WHERE name = '${detail.exercise}' ORDER BY set_index`) as any[];

                const exercise: exerciseType = {
                    name: detail.exercise,
                    sets: exerciseSets.map((set: any) => ({
                        rest: set.rest,
                        reps: set.reps,
                        weight: set.weight
                    })),
                };
                dayRes.exercises.push(exercise);
            } else if (detail.superset != null) {
                const [exercise1Name, exercise2Name] = detail.superset.split(',').map((name: string) => name.trim());

                const exercise1Sets = db.getAllSync(`SELECT * FROM exercise_details WHERE name = '${exercise1Name}' ORDER BY set_index`) as any[];
                const exercise2Sets = db.getAllSync(`SELECT * FROM exercise_details WHERE name = '${exercise2Name}' ORDER BY set_index`) as any[];

                const superSet: superSetType = {
                    exercise1: {
                        name: exercise1Name,
                        sets: exercise1Sets.map((set: any) => ({
                            rest: set.rest,
                            reps: set.reps,
                            weight: set.weight
                        })),
                    },
                    exercise2: {
                        name: exercise2Name,
                        sets: exercise2Sets.map((set: any) => ({
                            rest: set.rest,
                            reps: set.reps,
                            weight: set.weight
                        })),
                    }
                };
                dayRes.exercises.push(superSet);
            }
        }

        res.days.push(dayRes);
    }

    return res;
}

export {dbSetup, dbTeardown, addMockProgram, getProgram};