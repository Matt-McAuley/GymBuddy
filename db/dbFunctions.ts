import {setType, exerciseType, superSetType, dayType, programType} from "@/types/programType";
import * as SQLite from "expo-sqlite";

const dbSetup = (db:  SQLite.SQLiteDatabase) => {
    try {
        db.execSync(`
            PRAGMA foreign_keys=on;
        `);

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
            CREATE TABLE IF NOT EXISTS days (
                name TEXT PRIMARY KEY NOT NULL,
                color TEXT NOT NULL
            );
        `);

        db.execSync(`
            CREATE TABLE IF NOT EXISTS day_details (
                name TEXT NOT NULL,
                exercise_index INTEGER NOT NULL,
                exercise TEXT NULL,
                superset_1 TEXT NULL,
                superset_2 TEXT NULL,
                PRIMARY KEY (name, exercise_index),
                FOREIGN KEY (name) REFERENCES days(name) ON DELETE CASCADE,
                FOREIGN KEY (exercise) REFERENCES exercises(name) ON DELETE SET NULL,
                FOREIGN KEY (superset_1) REFERENCES exercises(name) ON DELETE SET NULL,
                FOREIGN KEY (superset_2) REFERENCES exercises(name) ON DELETE SET NULL
            );
        `);


        db.execSync(`
            CREATE TABLE IF NOT EXISTS programs (
                name TEXT PRIMARY KEY NOT NULL
            );
        `);

        db.execSync(`
            CREATE TABLE IF NOT EXISTS program_details (
                name TEXT NOT NULL,
                day_index INTEGER NOT NULL,
                day TEXT NULL,
                PRIMARY KEY (name, day_index),
                FOREIGN KEY (name) REFERENCES programs(name) ON DELETE CASCADE,
                FOREIGN KEY (day) REFERENCES days(name) ON DELETE SET NULL
            );
        `);

        db.execSync(`
           CREATE TABLE IF NOT EXISTS current_program (
               id INTEGER PRIMARY KEY NOT NULL,
               program NULL,
               FOREIGN KEY (program) REFERENCES programs(name) ON DELETE SET NULL
           );
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
        DROP TABLE IF EXISTS days;
        DROP TABLE IF EXISTS day_details;
        DROP TABLE IF EXISTS programs;
        DROP TABLE IF EXISTS program_details;
        DROP TABLE IF EXISTS current_program;
    `);
}

const addMockProgram = (db:  SQLite.SQLiteDatabase) => {
    try {
        const result = db.getFirstSync(`SELECT * FROM exercises`);
        if (result != null) return;

        db.execSync(`
            INSERT INTO exercises (name) VALUES ('Bench - 5x5');
            INSERT INTO exercises (name) VALUES ('Bench - 3x5');
            INSERT INTO exercises (name) VALUES ('Bench - 531');
            INSERT INTO exercises (name) VALUES ('DB OHP');
            INSERT INTO exercises (name) VALUES ('Dips');
            INSERT INTO exercises (name) VALUES ('Dips - SS');
            INSERT INTO exercises (name) VALUES ('Lateral Raise');
            INSERT INTO exercises (name) VALUES ('Tricep Extension');
            INSERT INTO exercises (name) VALUES ('Hanging Leg Raise');
            INSERT INTO exercises (name) VALUES ('Sissy Squat');
            INSERT INTO exercises (name) VALUES ('Deadlift - 5x5');
            INSERT INTO exercises (name) VALUES ('Deadlift - 3x5');
            INSERT INTO exercises (name) VALUES ('Deadlift - 531');
            INSERT INTO exercises (name) VALUES ('BB Curl 7s');
            INSERT INTO exercises (name) VALUES ('Lat Pulldown');
            INSERT INTO exercises (name) VALUES ('Reverse Wrist Curl');
            INSERT INTO exercises (name) VALUES ('Hammer Curl');
            INSERT INTO exercises (name) VALUES ('Face Pull');
            INSERT INTO exercises (name) VALUES ('Cable Crunch');
            INSERT INTO exercises (name) VALUES ('OHP - 5x5');
            INSERT INTO exercises (name) VALUES ('OHP - 3x5');
            INSERT INTO exercises (name) VALUES ('OHP - 531');
            INSERT INTO exercises (name) VALUES ('BB Row - 5x5');
            INSERT INTO exercises (name) VALUES ('BB Row - 3x5');
            INSERT INTO exercises (name) VALUES ('BB Row - 531');
            INSERT INTO exercises (name) VALUES ('DB Bench');
            INSERT INTO exercises (name) VALUES ('Wrist Curl');
            INSERT INTO exercises (name) VALUES ('BTB Shrug');
            INSERT INTO exercises (name) VALUES ('Squat - 5x5');
            INSERT INTO exercises (name) VALUES ('Squat - 3x5');
            INSERT INTO exercises (name) VALUES ('Squat - 531');
            INSERT INTO exercises (name) VALUES ('Hamstring Curl');
            INSERT INTO exercises (name) VALUES ('Leg Extension');
            INSERT INTO exercises (name) VALUES ('DB Curl');
            INSERT INTO exercises (name) VALUES ('Calf Raise');
        `);

        db.execSync(`
            -- Compound Lifts

            -- Bench Press sets
            INSERT INTO exercise_details (name, set_index, rest, weight, reps) VALUES ('Bench - 5x5', 1, 210, 215, 5);
            INSERT INTO exercise_details (name, set_index, rest, weight, reps) VALUES ('Bench - 5x5', 2, 210, 215, 5);
            INSERT INTO exercise_details (name, set_index, rest, weight, reps) VALUES ('Bench - 5x5', 3, 210, 215, 5);
            INSERT INTO exercise_details (name, set_index, rest, weight, reps) VALUES ('Bench - 5x5', 4, 210, 215, 5);
            INSERT INTO exercise_details (name, set_index, rest, weight, reps) VALUES ('Bench - 5x5', 5, 210, 215, 5);

            INSERT INTO exercise_details (name, set_index, rest, weight, reps) VALUES ('Bench - 3x5', 1, 210, 235, 3);
            INSERT INTO exercise_details (name, set_index, rest, weight, reps) VALUES ('Bench - 3x5', 2, 210, 235, 3);
            INSERT INTO exercise_details (name, set_index, rest, weight, reps) VALUES ('Bench - 3x5', 3, 210, 235, 3);
            INSERT INTO exercise_details (name, set_index, rest, weight, reps) VALUES ('Bench - 3x5', 4, 210, 235, 3);
            INSERT INTO exercise_details (name, set_index, rest, weight, reps) VALUES ('Bench - 3x5', 5, 210, 235, 3);

            INSERT INTO exercise_details (name, set_index, rest, weight, reps) VALUES ('Bench - 531', 1, 210, 215, 5);
            INSERT INTO exercise_details (name, set_index, rest, weight, reps) VALUES ('Bench - 531', 2, 210, 235, 3);
            INSERT INTO exercise_details (name, set_index, rest, weight, reps) VALUES ('Bench - 531', 3, 210, 260, 1);
            INSERT INTO exercise_details (name, set_index, rest, weight, reps) VALUES ('Bench - 531', 4, 210, 235, 3);
            INSERT INTO exercise_details (name, set_index, rest, weight, reps) VALUES ('Bench - 531', 5, 210, 215, 5);

            -- Squat sets
            INSERT INTO exercise_details (name, set_index, rest, weight, reps) VALUES ('Squat - 5x5', 1, 210, 235, 5);
            INSERT INTO exercise_details (name, set_index, rest, weight, reps) VALUES ('Squat - 5x5', 2, 210, 235, 5);
            INSERT INTO exercise_details (name, set_index, rest, weight, reps) VALUES ('Squat - 5x5', 3, 210, 235, 5);
            INSERT INTO exercise_details (name, set_index, rest, weight, reps) VALUES ('Squat - 5x5', 4, 210, 235, 5);
            INSERT INTO exercise_details (name, set_index, rest, weight, reps) VALUES ('Squat - 5x5', 5, 210, 235, 5);

            INSERT INTO exercise_details (name, set_index, rest, weight, reps) VALUES ('Squat - 3x5', 1, 210, 255, 3);
            INSERT INTO exercise_details (name, set_index, rest, weight, reps) VALUES ('Squat - 3x5', 2, 210, 255, 3);
            INSERT INTO exercise_details (name, set_index, rest, weight, reps) VALUES ('Squat - 3x5', 3, 210, 255, 3);
            INSERT INTO exercise_details (name, set_index, rest, weight, reps) VALUES ('Squat - 3x5', 4, 210, 255, 3);
            INSERT INTO exercise_details (name, set_index, rest, weight, reps) VALUES ('Squat - 3x5', 5, 210, 255, 3);

            INSERT INTO exercise_details (name, set_index, rest, weight, reps) VALUES ('Squat - 531', 1, 210, 235, 5);
            INSERT INTO exercise_details (name, set_index, rest, weight, reps) VALUES ('Squat - 531', 2, 210, 255, 3);
            INSERT INTO exercise_details (name, set_index, rest, weight, reps) VALUES ('Squat - 531', 3, 210, 295, 1);
            INSERT INTO exercise_details (name, set_index, rest, weight, reps) VALUES ('Squat - 531', 4, 210, 255, 3);
            INSERT INTO exercise_details (name, set_index, rest, weight, reps) VALUES ('Squat - 531', 5, 210, 235, 5);
            
            -- Deadlift sets
            INSERT INTO exercise_details (name, set_index, rest, weight, reps) VALUES ('Deadlift - 5x5', 1, 210, 345, 5);
            INSERT INTO exercise_details (name, set_index, rest, weight, reps) VALUES ('Deadlift - 5x5', 2, 210, 345, 5);
            INSERT INTO exercise_details (name, set_index, rest, weight, reps) VALUES ('Deadlift - 5x5', 3, 210, 345, 5);
            INSERT INTO exercise_details (name, set_index, rest, weight, reps) VALUES ('Deadlift - 5x5', 4, 210, 345, 5);
            INSERT INTO exercise_details (name, set_index, rest, weight, reps) VALUES ('Deadlift - 5x5', 5, 210, 345, 5);

            INSERT INTO exercise_details (name, set_index, rest, weight, reps) VALUES ('Deadlift - 3x5', 1, 210, 365, 3);
            INSERT INTO exercise_details (name, set_index, rest, weight, reps) VALUES ('Deadlift - 3x5', 2, 210, 365, 3);
            INSERT INTO exercise_details (name, set_index, rest, weight, reps) VALUES ('Deadlift - 3x5', 3, 210, 365, 3);
            INSERT INTO exercise_details (name, set_index, rest, weight, reps) VALUES ('Deadlift - 3x5', 4, 210, 365, 3);
            INSERT INTO exercise_details (name, set_index, rest, weight, reps) VALUES ('Deadlift - 3x5', 5, 210, 365, 3);

            INSERT INTO exercise_details (name, set_index, rest, weight, reps) VALUES ('Deadlift - 531', 1, 210, 345, 5);
            INSERT INTO exercise_details (name, set_index, rest, weight, reps) VALUES ('Deadlift - 531', 2, 210, 365, 3);
            INSERT INTO exercise_details (name, set_index, rest, weight, reps) VALUES ('Deadlift - 531', 3, 210, 425, 1);
            INSERT INTO exercise_details (name, set_index, rest, weight, reps) VALUES ('Deadlift - 531', 4, 210, 365, 3);
            INSERT INTO exercise_details (name, set_index, rest, weight, reps) VALUES ('Deadlift - 531', 5, 210, 345, 5);
            
            -- OHP sets
            INSERT INTO exercise_details (name, set_index, rest, weight, reps) VALUES ('OHP - 5x5', 1, 180, 120, 5);
            INSERT INTO exercise_details (name, set_index, rest, weight, reps) VALUES ('OHP - 5x5', 2, 180, 120, 5);
            INSERT INTO exercise_details (name, set_index, rest, weight, reps) VALUES ('OHP - 5x5', 3, 180, 120, 5);
            INSERT INTO exercise_details (name, set_index, rest, weight, reps) VALUES ('OHP - 5x5', 4, 180, 120, 5);
            INSERT INTO exercise_details (name, set_index, rest, weight, reps) VALUES ('OHP - 5x5', 5, 180, 120, 5);

            INSERT INTO exercise_details (name, set_index, rest, weight, reps) VALUES ('OHP - 3x5', 1, 180, 140, 3);
            INSERT INTO exercise_details (name, set_index, rest, weight, reps) VALUES ('OHP - 3x5', 2, 180, 140, 3);
            INSERT INTO exercise_details (name, set_index, rest, weight, reps) VALUES ('OHP - 3x5', 3, 180, 140, 3);
            INSERT INTO exercise_details (name, set_index, rest, weight, reps) VALUES ('OHP - 3x5', 4, 180, 140, 3);
            INSERT INTO exercise_details (name, set_index, rest, weight, reps) VALUES ('OHP - 3x5', 5, 180, 140, 3);

            INSERT INTO exercise_details (name, set_index, rest, weight, reps) VALUES ('OHP - 531', 1, 180, 120, 5);
            INSERT INTO exercise_details (name, set_index, rest, weight, reps) VALUES ('OHP - 531', 2, 180, 140, 3);
            INSERT INTO exercise_details (name, set_index, rest, weight, reps) VALUES ('OHP - 531', 3, 180, 150, 1);
            INSERT INTO exercise_details (name, set_index, rest, weight, reps) VALUES ('OHP - 531', 4, 180, 140, 3);
            INSERT INTO exercise_details (name, set_index, rest, weight, reps) VALUES ('OHP - 531', 5, 180, 120, 5);
            
            -- BB Row sets
            INSERT INTO exercise_details (name, set_index, rest, weight, reps) VALUES ('BB Row - 5x5', 1, 180, 175, 5);
            INSERT INTO exercise_details (name, set_index, rest, weight, reps) VALUES ('BB Row - 5x5', 2, 180, 175, 5);
            INSERT INTO exercise_details (name, set_index, rest, weight, reps) VALUES ('BB Row - 5x5', 3, 180, 175, 5);
            INSERT INTO exercise_details (name, set_index, rest, weight, reps) VALUES ('BB Row - 5x5', 4, 180, 175, 5);
            INSERT INTO exercise_details (name, set_index, rest, weight, reps) VALUES ('BB Row - 5x5', 5, 180, 175, 5);

            INSERT INTO exercise_details (name, set_index, rest, weight, reps) VALUES ('BB Row - 3x5', 1, 180, 195, 3);
            INSERT INTO exercise_details (name, set_index, rest, weight, reps) VALUES ('BB Row - 3x5', 2, 180, 195, 3);
            INSERT INTO exercise_details (name, set_index, rest, weight, reps) VALUES ('BB Row - 3x5', 3, 180, 195, 3);
            INSERT INTO exercise_details (name, set_index, rest, weight, reps) VALUES ('BB Row - 3x5', 4, 180, 195, 3);
            INSERT INTO exercise_details (name, set_index, rest, weight, reps) VALUES ('BB Row - 3x5', 5, 180, 195, 3);

            INSERT INTO exercise_details (name, set_index, rest, weight, reps) VALUES ('BB Row - 531', 1, 180, 175, 5);
            INSERT INTO exercise_details (name, set_index, rest, weight, reps) VALUES ('BB Row - 531', 2, 180, 195, 3);
            INSERT INTO exercise_details (name, set_index, rest, weight, reps) VALUES ('BB Row - 531', 3, 180, 195, 3);
            INSERT INTO exercise_details (name, set_index, rest, weight, reps) VALUES ('BB Row - 531', 4, 180, 195, 3);
            INSERT INTO exercise_details (name, set_index, rest, weight, reps) VALUES ('BB Row - 531', 5, 180, 175, 5);
        `);

        db.execSync(`
            -- Accessory Lifts

            -- DB OHP sets
            INSERT INTO exercise_details (name, set_index, rest, weight, reps) VALUES ('DB OHP', 1, 90, 45, 12);
            INSERT INTO exercise_details (name, set_index, rest, weight, reps) VALUES ('DB OHP', 2, 90, 45, 12);
            INSERT INTO exercise_details (name, set_index, rest, weight, reps) VALUES ('DB OHP', 3, 90, 45, 12);
            
            -- Dips sets
            INSERT INTO exercise_details (name, set_index, rest, weight, reps) VALUES ('Dips', 1, 90, 0, 15);
            INSERT INTO exercise_details (name, set_index, rest, weight, reps) VALUES ('Dips', 2, 90, 0, 15);
            INSERT INTO exercise_details (name, set_index, rest, weight, reps) VALUES ('Dips', 3, 90, 0, 15);

            -- Dips SS sets
            INSERT INTO exercise_details (name, set_index, rest, weight, reps) VALUES ('Dips - SS', 1, 60, 0, 15);
            INSERT INTO exercise_details (name, set_index, rest, weight, reps) VALUES ('Dips - SS', 2, 60, 0, 15);
            INSERT INTO exercise_details (name, set_index, rest, weight, reps) VALUES ('Dips - SS', 3, 60, 0, 15);
            
            -- Lateral Raise sets
            INSERT INTO exercise_details (name, set_index, rest, weight, reps) VALUES ('Lateral Raise', 1, 60, 20, 12);
            INSERT INTO exercise_details (name, set_index, rest, weight, reps) VALUES ('Lateral Raise', 2, 60, 20, 12);
            INSERT INTO exercise_details (name, set_index, rest, weight, reps) VALUES ('Lateral Raise', 3, 60, 20, 12);
            
            -- Tricep Extension sets
            INSERT INTO exercise_details (name, set_index, rest, weight, reps) VALUES ('Tricep Extension', 1, 60, 33, 12);
            INSERT INTO exercise_details (name, set_index, rest, weight, reps) VALUES ('Tricep Extension', 2, 60, 33, 12);
            INSERT INTO exercise_details (name, set_index, rest, weight, reps) VALUES ('Tricep Extension', 3, 60, 33, 12);
            
            -- Hanging Leg Raise sets
            INSERT INTO exercise_details (name, set_index, rest, weight, reps) VALUES ('Hanging Leg Raise', 1, 60, 0, 12);
            INSERT INTO exercise_details (name, set_index, rest, weight, reps) VALUES ('Hanging Leg Raise', 2, 60, 0, 12);
            INSERT INTO exercise_details (name, set_index, rest, weight, reps) VALUES ('Hanging Leg Raise', 3, 60, 0, 12);
            
            -- BB Curl 7s sets
            INSERT INTO exercise_details (name, set_index, rest, weight, reps) VALUES ('BB Curl 7s', 1, 90, 45, 21);
            INSERT INTO exercise_details (name, set_index, rest, weight, reps) VALUES ('BB Curl 7s', 2, 90, 45, 21);
            INSERT INTO exercise_details (name, set_index, rest, weight, reps) VALUES ('BB Curl 7s', 3, 90, 45, 21);
            
            -- Lat Pulldown sets
            INSERT INTO exercise_details (name, set_index, rest, weight, reps) VALUES ('Lat Pulldown', 1, 60, 143, 12);
            INSERT INTO exercise_details (name, set_index, rest, weight, reps) VALUES ('Lat Pulldown', 2, 60, 143, 12);
            INSERT INTO exercise_details (name, set_index, rest, weight, reps) VALUES ('Lat Pulldown', 3, 60, 143, 12);
            
            -- Hammer Curl sets
            INSERT INTO exercise_details (name, set_index, rest, weight, reps) VALUES ('Hammer Curl', 1, 60, 30, 12);
            INSERT INTO exercise_details (name, set_index, rest, weight, reps) VALUES ('Hammer Curl', 2, 60, 30, 12);
            INSERT INTO exercise_details (name, set_index, rest, weight, reps) VALUES ('Hammer Curl', 3, 60, 30, 12);
            
            -- Face Pull sets
            INSERT INTO exercise_details (name, set_index, rest, weight, reps) VALUES ('Face Pull', 1, 60, 15, 15);
            INSERT INTO exercise_details (name, set_index, rest, weight, reps) VALUES ('Face Pull', 2, 60, 15, 15);
            INSERT INTO exercise_details (name, set_index, rest, weight, reps) VALUES ('Face Pull', 3, 60, 15, 15);
            
            -- Cable Crunch sets
            INSERT INTO exercise_details (name, set_index, rest, weight, reps) VALUES ('Cable Crunch', 1, 60, 60, 12);
            INSERT INTO exercise_details (name, set_index, rest, weight, reps) VALUES ('Cable Crunch', 2, 60, 60, 12);
            INSERT INTO exercise_details (name, set_index, rest, weight, reps) VALUES ('Cable Crunch', 3, 60, 60, 12);
            
            -- DB Bench sets
            INSERT INTO exercise_details (name, set_index, rest, weight, reps) VALUES ('DB Bench', 1, 90, 65, 12);
            INSERT INTO exercise_details (name, set_index, rest, weight, reps) VALUES ('DB Bench', 2, 90, 65, 12);
            INSERT INTO exercise_details (name, set_index, rest, weight, reps) VALUES ('DB Bench', 3, 90, 65, 12);
            INSERT INTO exercise_details (name, set_index, rest, weight, reps) VALUES ('DB Bench', 4, 90, 65, 12);
            
            -- BTB Shrug sets
            INSERT INTO exercise_details (name, set_index, rest, weight, reps) VALUES ('BTB Shrug', 1, 60, 50, 12);
            INSERT INTO exercise_details (name, set_index, rest, weight, reps) VALUES ('BTB Shrug', 2, 60, 50, 12);
            INSERT INTO exercise_details (name, set_index, rest, weight, reps) VALUES ('BTB Shrug', 3, 60, 50, 12);
            
            -- Hamstring Curl sets
            INSERT INTO exercise_details (name, set_index, rest, weight, reps) VALUES ('Hamstring Curl', 1, 60, 45, 12);
            INSERT INTO exercise_details (name, set_index, rest, weight, reps) VALUES ('Hamstring Curl', 2, 60, 45, 12);
            INSERT INTO exercise_details (name, set_index, rest, weight, reps) VALUES ('Hamstring Curl', 3, 60, 45, 12);
            
            -- Leg Extension sets
            INSERT INTO exercise_details (name, set_index, rest, weight, reps) VALUES ('Leg Extension', 1, 60, 120, 12);
            INSERT INTO exercise_details (name, set_index, rest, weight, reps) VALUES ('Leg Extension', 2, 60, 120, 12);
            INSERT INTO exercise_details (name, set_index, rest, weight, reps) VALUES ('Leg Extension', 3, 60, 120, 12);
            
            -- DB Curl sets
            INSERT INTO exercise_details (name, set_index, rest, weight, reps) VALUES ('DB Curl', 1, 60, 35, 12);
            INSERT INTO exercise_details (name, set_index, rest, weight, reps) VALUES ('DB Curl', 2, 60, 35, 12);
            INSERT INTO exercise_details (name, set_index, rest, weight, reps) VALUES ('DB Curl', 3, 60, 35, 12);
            
            -- Wrist Curl sets
            INSERT INTO exercise_details (name, set_index, rest, weight, reps) VALUES ('Wrist Curl', 1, 90, 10, 12);
            INSERT INTO exercise_details (name, set_index, rest, weight, reps) VALUES ('Wrist Curl', 2, 90, 10, 12);
            INSERT INTO exercise_details (name, set_index, rest, weight, reps) VALUES ('Wrist Curl', 3, 90, 10, 12);
            INSERT INTO exercise_details (name, set_index, rest, weight, reps) VALUES ('Wrist Curl', 4, 90, 10, 12);
            
            -- Reverse Wrist Curl sets
            INSERT INTO exercise_details (name, set_index, rest, weight, reps) VALUES ('Reverse Wrist Curl', 1, 60, 10, 12);
            INSERT INTO exercise_details (name, set_index, rest, weight, reps) VALUES ('Reverse Wrist Curl', 2, 60, 10, 12);
            INSERT INTO exercise_details (name, set_index, rest, weight, reps) VALUES ('Reverse Wrist Curl', 3, 60, 10, 12);
            
            -- Sissy Squat sets
            INSERT INTO exercise_details (name, set_index, rest, weight, reps) VALUES ('Sissy Squat', 1, 60, 0, 12);
            INSERT INTO exercise_details (name, set_index, rest, weight, reps) VALUES ('Sissy Squat', 2, 60, 0, 12);
            INSERT INTO exercise_details (name, set_index, rest, weight, reps) VALUES ('Sissy Squat', 3, 60, 0, 12);
            
            -- Calf Raise sets
            INSERT INTO exercise_details (name, set_index, rest, weight, reps) VALUES ('Calf Raise', 1, 60, 80, 12);
            INSERT INTO exercise_details (name, set_index, rest, weight, reps) VALUES ('Calf Raise', 2, 60, 80, 12);
            INSERT INTO exercise_details (name, set_index, rest, weight, reps) VALUES ('Calf Raise', 3, 60, 80, 12);
        `);

        db.execSync(`
            INSERT INTO days (name, color) VALUES ('Push - 5x5', 'red');
            INSERT INTO days (name, color) VALUES ('Push - 3x5', 'red');
            INSERT INTO days (name, color) VALUES ('Push - 531', 'red');
            INSERT INTO days (name, color) VALUES ('Pull - 5x5', 'blue');
            INSERT INTO days (name, color) VALUES ('Pull - 3x5', 'blue');
            INSERT INTO days (name, color) VALUES ('Pull - 531', 'blue');
            INSERT INTO days (name, color) VALUES ('Upper - 5x5', 'purple');
            INSERT INTO days (name, color) VALUES ('Upper - 3x5', 'purple');
            INSERT INTO days (name, color) VALUES ('Upper - 531', 'purple');
            INSERT INTO days (name, color) VALUES ('Lower & Arms - 5x5', 'green');
            INSERT INTO days (name, color) VALUES ('Lower & Arms - 3x5', 'green');
            INSERT INTO days (name, color) VALUES ('Lower & Arms - 531', 'green');
        `);

        // Insert day details for mock program
            db.execSync(`
                INSERT INTO day_details (name, exercise_index, exercise, superset_1, superset_2) VALUES ('Push - 5x5', 1, 'Bench - 5x5', NULL, NULL);
                INSERT INTO day_details (name, exercise_index, exercise, superset_1, superset_2) VALUES ('Push - 5x5', 2, 'DB OHP', NULL, NULL);
                INSERT INTO day_details (name, exercise_index, exercise, superset_1, superset_2) VALUES ('Push - 5x5', 3, 'Dips', NULL, NULL);
                INSERT INTO day_details (name, exercise_index, exercise, superset_1, superset_2) VALUES ('Push - 5x5', 4, NULL, 'Lateral Raise', 'Tricep Extension');
                INSERT INTO day_details (name, exercise_index, exercise, superset_1, superset_2) VALUES ('Push - 5x5', 5, NULL, 'Hanging Leg Raise', 'Sissy Squat');

                INSERT INTO day_details (name, exercise_index, exercise, superset_1, superset_2) VALUES ('Push - 3x5', 1, 'Bench - 3x5', NULL, NULL);
                INSERT INTO day_details (name, exercise_index, exercise, superset_1, superset_2) VALUES ('Push - 3x5', 2, 'DB OHP', NULL, NULL);
                INSERT INTO day_details (name, exercise_index, exercise, superset_1, superset_2) VALUES ('Push - 3x5', 3, 'Dips', NULL, NULL);
                INSERT INTO day_details (name, exercise_index, exercise, superset_1, superset_2) VALUES ('Push - 3x5', 4, NULL, 'Lateral Raise', 'Tricep Extension');
                INSERT INTO day_details (name, exercise_index, exercise, superset_1, superset_2) VALUES ('Push - 3x5', 5, NULL, 'Hanging Leg Raise', 'Sissy Squat');

                INSERT INTO day_details (name, exercise_index, exercise, superset_1, superset_2) VALUES ('Push - 531', 1, 'Bench - 531', NULL, NULL);
                INSERT INTO day_details (name, exercise_index, exercise, superset_1, superset_2) VALUES ('Push - 531', 2, 'DB OHP', NULL, NULL);
                INSERT INTO day_details (name, exercise_index, exercise, superset_1, superset_2) VALUES ('Push - 531', 3, 'Dips', NULL, NULL);
                INSERT INTO day_details (name, exercise_index, exercise, superset_1, superset_2) VALUES ('Push - 531', 4, NULL, 'Lateral Raise', 'Tricep Extension');
                INSERT INTO day_details (name, exercise_index, exercise, superset_1, superset_2) VALUES ('Push - 531', 5, NULL, 'Hanging Leg Raise', 'Sissy Squat');
            `);

            db.execSync(`
                -- Pull Day Variants
                INSERT INTO day_details (name, exercise_index, exercise, superset_1, superset_2) VALUES ('Pull - 5x5', 1, 'Deadlift - 5x5', NULL, NULL);
                INSERT INTO day_details (name, exercise_index, exercise, superset_1, superset_2) VALUES ('Pull - 5x5', 2, 'BB Curl 7s', NULL, NULL);
                INSERT INTO day_details (name, exercise_index, exercise, superset_1, superset_2) VALUES ('Pull - 5x5', 3, NULL, 'Lat Pulldown', 'Reverse Wrist Curl');
                INSERT INTO day_details (name, exercise_index, exercise, superset_1, superset_2) VALUES ('Pull - 5x5', 4, NULL, 'Hammer Curl', 'Face Pull');
                INSERT INTO day_details (name, exercise_index, exercise, superset_1, superset_2) VALUES ('Pull - 5x5', 5, NULL, 'Cable Crunch', 'Sissy Squat');
            `);

            db.execSync(`
                INSERT INTO day_details (name, exercise_index, exercise, superset_1, superset_2) VALUES ('Pull - 3x5', 1, 'Deadlift - 3x5', NULL, NULL);
                INSERT INTO day_details (name, exercise_index, exercise, superset_1, superset_2) VALUES ('Pull - 3x5', 2, 'BB Curl 7s', NULL, NULL);
                INSERT INTO day_details (name, exercise_index, exercise, superset_1, superset_2) VALUES ('Pull - 3x5', 3, NULL, 'Lat Pulldown', 'Reverse Wrist Curl');
                INSERT INTO day_details (name, exercise_index, exercise, superset_1, superset_2) VALUES ('Pull - 3x5', 4, NULL, 'Hammer Curl', 'Face Pull');
                INSERT INTO day_details (name, exercise_index, exercise, superset_1, superset_2) VALUES ('Pull - 3x5', 5, NULL, 'Cable Crunch', 'Sissy Squat');
            `);

            db.execSync(`
                INSERT INTO day_details (name, exercise_index, exercise, superset_1, superset_2) VALUES ('Pull - 531', 1, 'Deadlift - 531', NULL, NULL);
                INSERT INTO day_details (name, exercise_index, exercise, superset_1, superset_2) VALUES ('Pull - 531', 2, 'BB Curl 7s', NULL, NULL);
                INSERT INTO day_details (name, exercise_index, exercise, superset_1, superset_2) VALUES ('Pull - 531', 3, NULL, 'Lat Pulldown', 'Reverse Wrist Curl');
                INSERT INTO day_details (name, exercise_index, exercise, superset_1, superset_2) VALUES ('Pull - 531', 4, NULL, 'Hammer Curl', 'Face Pull');
                INSERT INTO day_details (name, exercise_index, exercise, superset_1, superset_2) VALUES ('Pull - 531', 5, NULL, 'Cable Crunch', 'Sissy Squat');
            `);

            db.execSync(`
                -- Upper Day Variants
                INSERT INTO day_details (name, exercise_index, exercise, superset_1, superset_2) VALUES ('Upper - 5x5', 1, 'OHP - 5x5', NULL, NULL);
                INSERT INTO day_details (name, exercise_index, exercise, superset_1, superset_2) VALUES ('Upper - 5x5', 2, 'BB Row - 5x5', NULL, NULL);
                INSERT INTO day_details (name, exercise_index, exercise, superset_1, superset_2) VALUES ('Upper - 5x5', 3, NULL, 'DB Bench', 'Wrist Curl');
                INSERT INTO day_details (name, exercise_index, exercise, superset_1, superset_2) VALUES ('Upper - 5x5', 4, NULL, 'Lateral Raise', 'BTB Shrug');
                INSERT INTO day_details (name, exercise_index, exercise, superset_1, superset_2) VALUES ('Upper - 5x5', 5, NULL, 'Cable Crunch', 'Sissy Squat');
            `);

            db.execSync(`
                INSERT INTO day_details (name, exercise_index, exercise, superset_1, superset_2) VALUES ('Upper - 3x5', 1, 'OHP - 3x5', NULL, NULL);
                INSERT INTO day_details (name, exercise_index, exercise, superset_1, superset_2) VALUES ('Upper - 3x5', 2, 'BB Row - 3x5', NULL, NULL);
                INSERT INTO day_details (name, exercise_index, exercise, superset_1, superset_2) VALUES ('Upper - 3x5', 3, NULL, 'DB Bench', 'Wrist Curl');
                INSERT INTO day_details (name, exercise_index, exercise, superset_1, superset_2) VALUES ('Upper - 3x5', 4, NULL, 'Lateral Raise', 'BTB Shrug');
                INSERT INTO day_details (name, exercise_index, exercise, superset_1, superset_2) VALUES ('Upper - 3x5', 5, NULL, 'Cable Crunch', 'Sissy Squat');
            `);

            db.execSync(`
                INSERT INTO day_details (name, exercise_index, exercise, superset_1, superset_2) VALUES ('Upper - 531', 1, 'OHP - 531', NULL, NULL);
                INSERT INTO day_details (name, exercise_index, exercise, superset_1, superset_2) VALUES ('Upper - 531', 2, 'BB Row - 531', NULL, NULL);
                INSERT INTO day_details (name, exercise_index, exercise, superset_1, superset_2) VALUES ('Upper - 531', 3, NULL, 'DB Bench', 'Wrist Curl');
                INSERT INTO day_details (name, exercise_index, exercise, superset_1, superset_2) VALUES ('Upper - 531', 4, NULL, 'Lateral Raise', 'BTB Shrug');
                INSERT INTO day_details (name, exercise_index, exercise, superset_1, superset_2) VALUES ('Upper - 531', 5, NULL, 'Cable Crunch', 'Sissy Squat');
            `);

            db.execSync(`
                -- Lower & Arms Day Variants
                INSERT INTO day_details (name, exercise_index, exercise, superset_1, superset_2) VALUES ('Lower & Arms - 5x5', 1, 'Squat - 5x5', NULL, NULL);
                INSERT INTO day_details (name, exercise_index, exercise, superset_1, superset_2) VALUES ('Lower & Arms - 5x5', 2, NULL, 'Hamstring Curl', 'Dips - SS');
                INSERT INTO day_details (name, exercise_index, exercise, superset_1, superset_2) VALUES ('Lower & Arms - 5x5', 3, NULL, 'Leg Extension', 'DB Curl');
                INSERT INTO day_details (name, exercise_index, exercise, superset_1, superset_2) VALUES ('Lower & Arms - 5x5', 4, NULL, 'Hanging Leg Raise', 'Calf Raise');
            `);

            db.execSync(`
                INSERT INTO day_details (name, exercise_index, exercise, superset_1, superset_2) VALUES ('Lower & Arms - 3x5', 1, 'Squat - 3x5', NULL, NULL);
                INSERT INTO day_details (name, exercise_index, exercise, superset_1, superset_2) VALUES ('Lower & Arms - 3x5', 2, NULL, 'Hamstring Curl', 'Dips - SS');
                INSERT INTO day_details (name, exercise_index, exercise, superset_1, superset_2) VALUES ('Lower & Arms - 3x5', 3, NULL, 'Leg Extension', 'DB Curl');
                INSERT INTO day_details (name, exercise_index, exercise, superset_1, superset_2) VALUES ('Lower & Arms - 3x5', 4, NULL, 'Hanging Leg Raise', 'Calf Raise');
            `);

            db.execSync(`
                INSERT INTO day_details (name, exercise_index, exercise, superset_1, superset_2) VALUES ('Lower & Arms - 531', 1, 'Squat - 531', NULL, NULL);
                INSERT INTO day_details (name, exercise_index, exercise, superset_1, superset_2) VALUES ('Lower & Arms - 531', 2, NULL, 'Hamstring Curl', 'Dips - SS');
                INSERT INTO day_details (name, exercise_index, exercise, superset_1, superset_2) VALUES ('Lower & Arms - 531', 3, NULL, 'Leg Extension', 'DB Curl');
                INSERT INTO day_details (name, exercise_index, exercise, superset_1, superset_2) VALUES ('Lower & Arms - 531', 4, NULL, 'Hanging Leg Raise', 'Calf Raise');
            `);

            db.execSync(`
                INSERT INTO programs (name) VALUES ('PPUL - 5x5');
                INSERT INTO programs (name) VALUES ('PPUL - 3x5');
                INSERT INTO programs (name) VALUES ('PPUL - 531');
                `);

            db.execSync(`
                INSERT INTO program_details (name, day, day_index) VALUES ('PPUL - 5x5', 'Push - 5x5', 0);
                INSERT INTO program_details (name, day, day_index) VALUES ('PPUL - 5x5', 'Pull - 5x5', 1);
                INSERT INTO program_details (name, day, day_index) VALUES ('PPUL - 5x5', 'Upper - 5x5', 2);
                INSERT INTO program_details (name, day, day_index) VALUES ('PPUL - 5x5', 'Lower & Arms - 5x5', 3);

                INSERT INTO program_details (name, day, day_index) VALUES ('PPUL - 3x5', 'Push - 3x5', 0);
                INSERT INTO program_details (name, day, day_index) VALUES ('PPUL - 3x5', 'Pull - 3x5', 1);
                INSERT INTO program_details (name, day, day_index) VALUES ('PPUL - 3x5', 'Upper - 3x5', 2);
                INSERT INTO program_details (name, day, day_index) VALUES ('PPUL - 3x5', 'Lower & Arms - 3x5', 3);

                INSERT INTO program_details (name, day, day_index) VALUES ('PPUL - 531', 'Push - 531', 0);
                INSERT INTO program_details (name, day, day_index) VALUES ('PPUL - 531', 'Pull - 531', 1);
                INSERT INTO program_details (name, day, day_index) VALUES ('PPUL - 531', 'Upper - 531', 2);
                INSERT INTO program_details (name, day, day_index) VALUES ('PPUL - 531', 'Lower & Arms - 531', 3);
                `);

            db.execSync(`
                INSERT INTO current_program (program)
                VALUES ('PPUL - 5x5');
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
    if (currentProgram == null || currentProgram.program == null) return null;

    const program = db.getFirstSync(`SELECT * FROM programs WHERE name = ?`, [currentProgram.program]) as any;
    if (program == null) return null;
    res.name = program.name;

    // Get the days for the program from program_details
    const programDays = db.getAllSync(`SELECT day FROM program_details WHERE name = ? ORDER BY day_index`, [program.name]) as any[];
    
    for (const programDay of programDays) {
        const dayName = programDay.day;
        if (dayName == null) continue;
        
        const day = db.getFirstSync(`SELECT * FROM days WHERE name = ?`, [dayName]) as any;
        if (day == null) continue;
        
        const dayRes: dayType = {
            name: day.name,
            color: day.color,
            exercises: [],
        }

        // Get the details for the day
        const details = db.getAllSync(`SELECT * FROM day_details WHERE name = ? ORDER BY exercise_index`, [dayName]) as any[];

        for (const detail of details) {
            if (detail.exercise != null) {
                const exerciseSets = db.getAllSync(`SELECT * FROM exercise_details WHERE name = ? ORDER BY set_index`, [detail.exercise]) as any[];

                const exercise: exerciseType = {
                    name: detail.exercise,
                    sets: exerciseSets.map((set: any) => ({
                        rest: set.rest,
                        reps: set.reps,
                        weight: set.weight
                    })),
                };
                dayRes.exercises.push(exercise);
            } else if (detail.superset_1 != null) {
                const exercise1Name = detail.superset_1.trim();
                const exercise2Name = detail.superset_2.trim();

                const exercise1Sets = db.getAllSync(`SELECT * FROM exercise_details WHERE name = ? ORDER BY set_index`, [exercise1Name]) as any[];
                const exercise2Sets = db.getAllSync(`SELECT * FROM exercise_details WHERE name = ? ORDER BY set_index`, [exercise2Name]) as any[];

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