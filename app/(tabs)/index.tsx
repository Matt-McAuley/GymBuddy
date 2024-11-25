import { View, Text } from "react-native";
import Timer from "@/components/Timer";
import Counter from "@/components/Counter";
import ExerciseDisplay from "@/components/ExerciseDisplay";
import exerciseInfoType from "@/types/exerciseInfoType";
import programType from "@/types/programType";
import {useEffect, useState} from "react";
import dbSetup from "@/db/dbSetup";
import * as SQLite from 'expo-sqlite';

export default function Index() {
    const [day, setDay] = useState("Push");
    const [color, setColor] = useState("red");
    const [program, setProgram] = useState<programType | null>(null);
    const [exerciseInfo, setExerciseInfo] = useState<exerciseInfoType>({
        currentExercise: 'Bench',
        currentWeight: 185,
        nextExercise: 'Ham Curl',
        nextWeight: 45,
        prevExercise: 'Squat',
        prevWeight: 225,
        scheme: '5x5',
        nextExerciseHandler: nextExerciseHandler,
        prevExerciseHandler: prevExerciseHandler,
    });
    const db = SQLite.openDatabaseSync('programs.db');

    useEffect(() => {
        dbSetup(db);
    }, []);

    const nextExerciseHandler = () => {
        console.log('Next Exercise');
    }

    const prevExerciseHandler = () => {
        console.log('Previous Exercise');
    }

  return program == null ? (
        <Text className={"text-9xl"}>Loading...</Text>
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
