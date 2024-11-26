import {View, Text, ActivityIndicator} from "react-native";
import Timer from "@/components/Timer";
import Counter from "@/components/Counter";
import ExerciseDisplay from "@/components/ExerciseDisplay";
import {useEffect, useState} from "react";
import {addMockProgram, dbSetup, dbTeardown, getProgram} from "@/db/dbFunctions";
import * as SQLite from 'expo-sqlite';
import { useDrizzleStudio } from "expo-drizzle-studio-plugin";
import {useStore} from "@/store";

export default function Index() {
    const [day, setDay] = useState("");
    const [color, setColor] = useState("");
    const {program, setProgram} = useStore();
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
