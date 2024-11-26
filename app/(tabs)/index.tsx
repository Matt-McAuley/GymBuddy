import {View, Text, ActivityIndicator} from "react-native";
import Timer from "@/components/Timer";
import Counter from "@/components/Counter";
import ExerciseDisplay from "@/components/ExerciseDisplay";
import {useEffect, useState} from "react";
import {addMockProgram, dbSetup, dbTeardown, getProgram} from "@/db/dbFunctions";
import * as SQLite from 'expo-sqlite';
import { useDrizzleStudio } from "expo-drizzle-studio-plugin";
import {useStore} from "@/store";
import {GestureDetector, Gesture, GestureHandlerRootView, Directions} from "react-native-gesture-handler";
import {runOnJS} from "react-native-reanimated";

export default function Index() {
    const [day, setDay] = useState("");
    const [color, setColor] = useState("");
    const {program, setProgram, currentDay, setCurrentDay, setCurrentExercise} = useStore();
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

    useEffect(() => {
        if (program == null) return;
        setDay(program.days[currentDay].name);
        setColor(program.days[currentDay].color);
    }, [currentDay]);

    const panRight = Gesture.Fling().onEnd(() => {
        runOnJS(setCurrentExercise)(0);
        runOnJS(setCurrentDay)(Math.min(program!.days.length-1, Math.min(program!.days.length-1, currentDay + 1)));
    }).direction(Directions.LEFT);

    const panLeft = Gesture.Fling().onEnd(() => {
        runOnJS(setCurrentExercise)(0);
        runOnJS(setCurrentDay)(Math.min(program!.days.length-1, Math.max(0, currentDay - 1)));
    }).direction(Directions.RIGHT);


  return (program == null) ? (
      <View className={'flex justify-center items-center h-full'}>
        <ActivityIndicator className={'color-black'} size={'large'} />
      </View>
      )
      : (
          <GestureHandlerRootView>
              <GestureDetector gesture={panLeft}>
              <GestureDetector gesture={panRight}>
                <View className={'flex-1 flex-col justify-start items-center p-3 gap-4'}>
                    <Text className={`text-6xl font-bold`} style={{color: color}}>{day}</Text>
                    <Timer/>
                    <Counter/>
                    <ExerciseDisplay/>
                </View>
              </GestureDetector>
              </GestureDetector>
          </GestureHandlerRootView>
  );
}