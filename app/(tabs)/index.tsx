import {View, Text, ScrollView, Dimensions} from "react-native";
import Timer from "@/components/Home/Timer";
import Counter from "@/components/Home/Counter";
import ExerciseDisplay from "@/components/Home/ExerciseDisplay";
import {useEffect, useState} from "react";
import {addMockProgram, dbSetup, dbTeardown, getProgram} from "@/db/dbFunctions";
import { useDrizzleStudio } from "expo-drizzle-studio-plugin";
import {useStore} from "@/store";

export default function Index() {
    const {db, program, setProgram, currentDay, setCurrentDay, setCurrentExercise} = useStore();
    const {width, height} = Dimensions.get('window');
    useDrizzleStudio(db);

    useEffect(() => {
        dbTeardown(db);
        dbSetup(db);
        addMockProgram(db);
        setProgram(getProgram(db));
    }, []);

    useEffect(() => {
        if (program == null) return;
        if (program.days.length == 0) return;
        const firstDay = program.days[0];
    }, [program]);

    useEffect(() => {
        if (program == null) return;
        if (program.days.length == 0) return;
    }, [currentDay]);


  return (program == null) ? (
      <View className={'flex justify-center items-center h-full'}>
          <Text className={'text-3xl'}>No Program Selected</Text>
      </View>
      )
      : (program.days.length == 0) ? (
            <View className={'flex justify-center items-center h-full'}>
                <Text className={'text-3xl'}>No Days in Program</Text>
            </View>
        ) :
      (
          <ScrollView snapToInterval={width} decelerationRate={'fast'} horizontal>
              {program.days.map((day, index) => (
                  <View key={index} className={'flex-1 flex-col justify-start items-center p-3 gap-4'}>
                      <Text className={`text-6xl font-bold`} style={{color: day.color}}>{day.name}</Text>
                             {(day.exercises.length == 0) ?
                                 <View className={'flex-col h-full justify-center items-center'}>
                                     <Text className={'text-3xl'}>No Exercises in Day</Text>
                                 </View>
                                 :
                                 <>
                                     <Timer/>
                                     <Counter/>
                                     <ExerciseDisplay/>
                                 </>
                             }
                  </View>
                  ))}
          </ScrollView>

  );
}