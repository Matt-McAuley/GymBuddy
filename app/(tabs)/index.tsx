import { View, Text } from "react-native";
import Timer from "@/components/Timer";
import Counter from "@/components/Counter";
import ExerciseDisplay from "@/components/ExerciseDisplay";
import exerciseInfoType from "@/types/exerciseInfoType";
import { programType } from "@/types/programType";
import {useEffect, useState} from "react";
import {addMockProgram, dbSetup, dbTeardown, getProgram} from "@/db/dbFunctions";
import * as SQLite from 'expo-sqlite';
import { useDrizzleStudio } from "expo-drizzle-studio-plugin";

export default function Index() {
    const [day, setDay] = useState("");
    const [color, setColor] = useState("");
    const [program, setProgram] = useState<programType | null>(null);
    const [exerciseInfo, setExerciseInfo] = useState<exerciseInfoType>({
        currentExercise: '',
        currentWeight: [],
        currentRest: 0,
        currentSets: 0,
        currentReps: [],
        nextExercise: '',
        nextWeight: 0,
        prevExercise: '',
        prevWeight: 0,
        scheme: '',
        exerciseNumber: 0,
        nextExerciseHandler: nextExerciseHandler,
        prevExerciseHandler: prevExerciseHandler,
    });
    const db = SQLite.openDatabaseSync('programs.db');
    useDrizzleStudio(db);

    useEffect(() => {
        dbSetup(db);
        addMockProgram(db);
        setProgram(getProgram(db));
    }, []);

    useEffect(() => {
        if (program == null) return;
        console.log(program.days[0]!.primaryExercise);
        setExerciseInfo({
            currentExercise: program.days[0]!.primaryExercise.name,
            currentWeight: [program.days[0]!.primaryExercise.weight_1, program.days[0]!.primaryExercise.weight_2,
                program.days[0]!.primaryExercise.weight_3, program.days[0]!.primaryExercise.weight_2, program.days[0]!.primaryExercise.weight_1],
            currentRest: program.days[0]!.primaryExercise.rest,
            currentSets: program.days[0]!.primaryExercise.sets,
            currentReps: [program.days[0]!.primaryExercise.reps_1, program.days[0]!.primaryExercise.reps_2,
                program.days[0]!.primaryExercise.reps_3, program.days[0]!.primaryExercise.reps_2, program.days[0]!.primaryExercise.reps_1],
            nextExercise: program.days[0]!.accessoryExercises[0].name,
            nextWeight: program.days[0]!.accessoryExercises[0].weight,
            prevExercise: 'None',
            prevWeight: 0,
            scheme: '5x5',
            exerciseNumber: 1,
            nextExerciseHandler: nextExerciseHandler,
            prevExerciseHandler: prevExerciseHandler,
        })
        setColor(program.days[0]!.color);
        setDay(program.days[0]!.name);
    }, [program]);

    const nextExerciseHandler = () => {
        console.log('Next Exercise');
    }

    const prevExerciseHandler = () => {
        console.log('Previous Exercise');
    }

  return (program == null) ? (
        <Text className={"text-7xl"}>No Programs!</Text>
      )
      : (
    <View className={'flex-1 flex-col justify-start items-center p-3 gap-4'}>
        <Text className={`text-7xl font-bold color-${color}-500`}>{day}</Text>
        <Timer startTime={exerciseInfo.currentRest}/>
        <Counter sets={exerciseInfo.currentSets} reps={exerciseInfo.currentReps}/>
        <ExerciseDisplay exerciseInfo={exerciseInfo}/>
    </View>
  );
}
