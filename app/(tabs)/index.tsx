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
        const firstDay = program.days[0];
        const firstExercise = firstDay!.primaryExercise;
        const firstAccessory = firstDay!.accessoryExercises[0];
        setExerciseInfo({
            currentExercise: firstExercise.name,
            currentWeight: [firstExercise.weight_1, firstExercise.weight_2, firstExercise.weight_3, firstExercise.weight_2, firstExercise.weight_1],
            currentRest: firstExercise.rest,
            currentSets: firstExercise.sets,
            currentReps: [firstExercise.reps_1, firstExercise.reps_2, firstExercise.reps_3, firstExercise.reps_2, firstExercise.reps_1],
            nextExercise: firstAccessory.name,
            nextWeight: firstAccessory.weight,
            prevExercise: 'None',
            prevWeight: 0,
            scheme: '5x5',
            exerciseNumber: 1,
            nextExerciseHandler: nextExerciseHandler,
            prevExerciseHandler: prevExerciseHandler,
        })
        setColor(firstDay!.color);
        setDay(firstDay!.name);
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
