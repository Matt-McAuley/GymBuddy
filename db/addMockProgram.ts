export default function addMockProgram(db) {
    db.execSync(`
        INSERT INTO primary_exercises (name, weight_1, weight_2, weight_3, reps_1, reps_2, reps_3) VALUES ('Bench', 190, 215, 245, 5, 3, 1);
        INSERT INTO accessory_exercises (name, weight, reps, sets) VALUES ('DB OHP', 45, 12, 3);
        INSERT INTO accessory_exercises (name, weight, reps, sets) VALUES ('Dips', 0, 12, 3);
        INSERT INTO accessory_exercises (name, weight, reps, sets) VALUES ('Incline Bench', 50, 12, 3);
        INSERT INTO accessory_exercises (name, weight, reps, sets) VALUES ('Lateral Raise', 20, 15, 3);
        INSERT INTO accessory_exercises (name, weight, reps, sets) VALUES ('Tricep Extension', 35, 15, 3);
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