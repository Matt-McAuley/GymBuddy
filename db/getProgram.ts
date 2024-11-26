import {programType, dayType, primaryExerciseType, accessoryExerciseType} from "@/types/programType";

export default function getProgram(db) {
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
                sets: 0,
                reps1: 0,
                weight1: 0,
                reps2: 0,
                weight2: 0,
                reps3: 0,
                weight3: 0
            },
            accessoryExercises: [],
            supersetExercises: []
        }

        // Get the primary exercise
        let primaryExercise = db.getFirstSync(`SELECT * FROM primary_exercises WHERE id = ${day.exercise_1}`);
        dayRes.primaryExercise.name = primaryExercise.name;
        dayRes.primaryExercise.sets = primaryExercise.sets;
        dayRes.primaryExercise.reps1 = primaryExercise.reps1;
        dayRes.primaryExercise.weight1 = primaryExercise.weight1;
        dayRes.primaryExercise.reps2 = primaryExercise.reps2;
        dayRes.primaryExercise.weight2 = primaryExercise.weight2;
        dayRes.primaryExercise.reps3 = primaryExercise.reps3;
        dayRes.primaryExercise.weight3 = primaryExercise.weight3;


        // Get the accessory exercises
        for (let i = 2; i < 6; i++) {
            if (day[`exercise_${i}`] != null) {
                let accessoryExercise = db.getFirstSync(`SELECT * FROM accessory_exercises WHERE id = ${day[`exercise_${i}`]}`);
                const accessoryExerciseRes: accessoryExerciseType = {
                    name: accessoryExercise.name,
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
                        sets: exercise1.sets,
                        reps: exercise1.reps,
                        weight: exercise1.weight
                    },
                    exercise2: {
                        name: exercise2.name,
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