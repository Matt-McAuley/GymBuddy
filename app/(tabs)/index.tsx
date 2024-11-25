import { View, Text } from "react-native";
import Timer from "@/components/Timer";
import Counter from "@/components/Counter";
import ExerciseDisplay from "@/components/ExerciseDisplay";
import exerciseInfoType from "@/types/exerciseInfoType";
import programType from "@/types/programType";
import {useEffect, useState} from "react";
import dbSetup from "@/db/dbSetup";
import getProgram from "@/db/getProgram";
import * as SQLite from 'expo-sqlite';

export default function Index() {
    const [day, setDay] = useState("Push");
    const [color, setColor] = useState("red");
    const [program, setProgram] = useState<programType | null>(null);
    const [exerciseInfo, setExerciseInfo] = useState<exerciseInfoType>({
        currentExercise: 'Bench',
        currentWeight: 185,
        nextExercise: 'Ham Curl',
        nextWeight: '45',
        prevExercise: 'Squat',
        prevWeight: '225',
        scheme: '5x5',
        nextExerciseHandler: nextExerciseHandler,
        prevExerciseHandler: prevExerciseHandler,
    });
    const db = SQLite.openDatabaseSync('programs.db');

    useEffect(() => {
        dbSetup(db);
        // setProgram(getProgram(db))
        if (program == null) {
            return;
        }
        setExerciseInfo({
            currentExercise: program.days[0].primaryExercise.name,
            currentWeight: program.days[0].primaryExercise.weight1,
            nextExercise: program.days[0].accessoryExercises[0].name,
            nextWeight: program.days[0].accessoryExercises[0].weight,
            prevExercise: 'None',
            prevWeight: '--',
            scheme: '5x5',
            nextExerciseHandler: nextExerciseHandler,
            prevExerciseHandler: prevExerciseHandler,
        })
    }, []);

    const nextExerciseHandler = () => {
        console.log('Next Exercise');
    }

    const prevExerciseHandler = () => {
        console.log('Previous Exercise');
    }

  return program == null ? (
        <Text className={"text-7xl"}>No Programs!</Text>
      )
      : (
    <View className={'flex-1 flex-col justify-start items-center p-3 gap-4'}>
        <Text className={`text-7xl font-bold color-${color}-500`}>{day}</Text>
        <Timer startTime={60}/>
        <Counter sets={5} reps={[5, 3, 1, 3, 5]}/>
        <ExerciseDisplay exerciseInfo={exerciseInfo}/>
    </View>
  );
}
