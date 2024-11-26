const dbSetup = (db) => {
    try {
        db.execSync(`
            CREATE TABLE IF NOT EXISTS accessory_exercises (
                id INTEGER PRIMARY KEY NOT NULL,
                name TEXT NOT NULL,
                weight INTEGER NOT NULL,
                sets INTEGER NOT NULL,
                reps INTEGER NOT NULL
            );
        `);

        db.execSync(`
            CREATE TABLE IF NOT EXISTS primary_exercises (
                id INTEGER PRIMARY KEY NOT NULL,
                name TEXT NOT NULL,
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

export default dbSetup;