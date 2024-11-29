import {View, Text, ActivityIndicator} from "react-native";
import Timer from "@/components/Home/Timer";
import Counter from "@/components/Home/Counter";
import ExerciseDisplay from "@/components/Home/ExerciseDisplay";
import {useEffect, useState} from "react";
import {addMockProgram, dbSetup, dbTeardown, getProgram} from "@/db/dbFunctions";
import { useDrizzleStudio } from "expo-drizzle-studio-plugin";
import {useStore} from "@/store";
import {GestureDetector, Gesture, GestureHandlerRootView, Directions} from "react-native-gesture-handler";
import {runOnJS} from "react-native-reanimated";

export default function Index() {
    const [day, setDay] = useState("");
    const [color, setColor] = useState("");
    const {db, program, setProgram, currentDay, setCurrentDay, setCurrentExercise} = useStore();
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
          <Text className={'text-3xl'}>No Program Selected</Text>
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