import {View, Text, ActivityIndicator} from "react-native";
import Timer from "@/components/Timer";
import Counter from "@/components/Counter";
import ExerciseDisplay from "@/components/ExerciseDisplay";
import {useEffect, useState} from "react";
import {addMockProgram, dbSetup, dbTeardown, getProgram} from "@/db/dbFunctions";
import * as SQLite from 'expo-sqlite';
import { useDrizzleStudio } from "expo-drizzle-studio-plugin";
import {useStore} from "@/store";
import {isA} from "@jest/expect-utils";

export default function Index() {
    const [day, setDay] = useState("");
    const [color, setColor] = useState("");
    const {setExerciseInfo, program, setProgram, isPrimaryExercise, isAccessoryExercise, isSuperSet} = useStore();
    const db = SQLite.openDatabaseSync('programs.db');
    useDrizzleStudio(db);

    useEffect(() => {
        // dbTeardown(db);
        dbSetup(db);
        addMockProgram(db);
        setProgram(getProgram(db));
    }, []);

    useEffect(() => {
        if (program == null) return;
        const firstDay = program.days[0];
        // const firstExercise = firstDay!.exercises[0];
        // const secondExercise = firstDay!.exercises[1];
        // setExerciseInfo({
        //     currentExercise: firstExercise.name,
        //     currentWeight: (isPrimaryExercise(firstExercise)) ? [firstExercise.weight_1, firstExercise.weight_2, firstExercise.weight_3, firstExercise.weight_2, firstExercise.weight_1]
        //         : (isAccessoryExercise(firstExercise)) ? new Array(5).fill(firstExercise.weight)
        //             : (isSuperSet(firstExercise)) ? [firstExercise.exercise1.weight, firstExercise.exercise2.weight, firstExercise.exercise1.weight, firstExercise.exercise2.weight, firstExercise.exercise1.weight] : [],
        //     currentRest: firstExercise.rest,
        //     currentSets: firstExercise.sets,
        //     currentReps: [firstExercise.reps_1, firstExercise.reps_2, firstExercise.reps_3, firstExercise.reps_2, firstExercise.reps_1],
        //     nextExercise: firstAccessory.name,
        //     nextWeight: firstAccessory.weight,
        //     prevExercise: 'None',
        //     prevWeight: 0,
        //     scheme: '5x5',
        //     exerciseNumber: 1,
        // });
        setColor(firstDay!.color);
        setDay(firstDay!.name);
    }, [program]);


  return (program == null) ? (
      <View className={'flex justify-center items-center h-full'}>
        <ActivityIndicator className={'color-black'} size={'large'} />
      </View>
      )
      : (
    <View className={'flex-1 flex-col justify-start items-center p-3 gap-4'}>
        <Text className={`text-7xl font-bold color-${color}-500`}>{day}</Text>
        <Timer/>
        <Counter/>
        <ExerciseDisplay/>
    </View>
  );
}
