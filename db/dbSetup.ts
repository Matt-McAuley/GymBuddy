const dbSetup = async (db) => {
    await db.execAsync(`
            CREATE TABLE IF NOT EXISTS accessory_exercises (
                id INTEGER PRIMARY KEY NOT NULL,
                name TEXT NOT NULL,
                weight INTEGER NOT NULL,
                sets INTEGER NOT NULL,
                reps INTEGER NOT NULL,
                order INTEGER NOT NULL
            );
           
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
           
            CREATE TABLE IF NOT EXISTS supersets (
                id INTEGER PRIMARY KEY NOT NULL,
                order INTEGER NOT NULL,
                exercise_1 INTEGER NOT NULL FOREIGN KEY REFERENCES accessory_exercises(id),
                exercise_2 INTEGER NOT NULL FOREIGN KEY REFERENCES accessory_exercises(id),
            );
           
            CREATE TABLE IF NOT EXISTS days (
                id INTEGER PRIMARY KEY NOT NULL,
                name TEXT NOT NULL,
                color TEXT NOT NULL,
                exercise_1 INTEGER NULL FOREIGN KEY REFERENCES primary_exercises(id),
                exercise_2 INTEGER NULL FOREIGN KEY REFERENCES accessory_exercises(id),
                exercise_3 INTEGER NULL FOREIGN KEY REFERENCES accessory_exercises(id),
                exercise_4 INTEGER NULL FOREIGN KEY REFERENCES accessory_exercises(id),
                exercise_5 INTEGER NULL FOREIGN KEY REFERENCES accessory_exercises(id),
                superset_1 INTEGER NULL FOREIGN KEY REFERENCES supersets(id),
                superset_2 INTEGER NULL FOREIGN KEY REFERENCES supersets(id),
            );
            
            CREATE TABLE IF NOT EXISTS programs (
                id INTEGER PRIMARY KEY NOT NULL,
                name TEXT NOT NULL,
                monday INTEGER NULL FOREIGN KEY REFERENCES days(id),
                tuesday INTEGER NULL FOREIGN KEY REFERENCES days(id),
                wednesday INTEGER NULL FOREIGN KEY REFERENCES days(id),
                thursday INTEGER NULL FOREIGN KEY REFERENCES days(id),
                friday INTEGER NULL FOREIGN KEY REFERENCES days(id),
                saturday INTEGER NULL FOREIGN KEY REFERENCES days(id),
                sunday INTEGER NULL FOREIGN KEY REFERENCES days(id),
            );
            
           CREATE TABLE IF NOT EXISTS current_program (
               id INTEGER PRIMARY KEY NOT NULL,
               program INTEGER NOT NULL FOREIGN KEY REFERENCES programs(id),
        `);
}

export default dbSetup;