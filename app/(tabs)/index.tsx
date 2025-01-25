import {View, Text, ScrollView, Dimensions} from "react-native";
import Timer from "@/components/Home/Timer";
import Counter from "@/components/Home/Counter";
import ExerciseDisplay from "@/components/Home/ExerciseDisplay";
import {useEffect, useRef, useState} from "react";
import {addMockProgram, dbSetup, dbTeardown, getProgram} from "@/db/dbFunctions";
import { useDrizzleStudio } from "expo-drizzle-studio-plugin";
import {useStore} from "@/store";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Index() {
    const {db, program, setProgram, currentDay, setCurrentDay, setCurrentExercise, timesReset,
        setCurrentScheme, setSet, setRetrievedTime, currentExercise, setRetrievedPaused, setRetrievedYet, setRetrievedSet} = useStore();
    const {width} = Dimensions.get('window');
    const dayScrollRef = useRef<ScrollView | null>(null);
    const exerciseScrollRefs = useRef<{ [key: number]: ScrollView | null }>({});
    useDrizzleStudio(db);

    const retrieveOverwrittenValues = async () => {
        const timer = await AsyncStorage.getItem('timer');
        const initialTime = await AsyncStorage.getItem('initialTime');
        const startTime = await AsyncStorage.getItem('startTime');
        const newTime = (initialTime === null || startTime === null) ? (timer === null) ? null : parseInt(timer) :
            Math.max(1, parseInt(startTime) - Math.floor((new Date().getTime() - parseInt(initialTime)) / 1000));
        console.log('timer', timer);
        console.log('time passed', (new Date().getTime() - parseInt(initialTime || '0')) / 1000);
        console.log('newTime', newTime);
        const paused = await AsyncStorage.getItem('paused');
        const set = await AsyncStorage.getItem('set');
        setRetrievedTime(newTime);
        setRetrievedPaused((paused === null) ? null : (paused === 'true'));
        setRetrievedSet((set === null) ? null : parseInt(set));
    }

    const retrieveOtherValues = async () => {
        const day = await AsyncStorage.getItem('currentDay');
        const exercise = await AsyncStorage.getItem('currentExercise');
        const scheme = await AsyncStorage.getItem('currentScheme');
        dayScrollRef.current?.scrollTo({x: parseInt(day || '0') * width, y: 0, animated: false});
        Object.keys(exerciseScrollRefs.current).forEach((key) => {
            exerciseScrollRefs.current[parseInt(key)]?.scrollTo({x: parseInt(exercise || '0') * width, y: 0, animated: false});
        });
        setCurrentDay(parseInt(day || '0'));
        setCurrentExercise(parseInt(exercise || '0'));
        setCurrentScheme(scheme || '5 x 5');
    }

    useEffect(() => {
        // dbTeardown(db);
        // dbSetup(db);
        // addMockProgram(db);
        retrieveOverwrittenValues().then(() => {
            setProgram(getProgram(db));
            retrieveOtherValues().then(() => {
                setRetrievedYet(true);
            });
        });
    }, []);

    const handleDayScroll = (event: any) => {
        const contentOffsetX = event.nativeEvent.contentOffset.x;
        const day = Math.min(Math.max(Math.ceil((contentOffsetX-195) / width), 0), program!.days.length - 1);
        if (day != currentDay) {
            Object.keys(exerciseScrollRefs.current).forEach((key) => {
                exerciseScrollRefs.current[parseInt(key)]?.scrollTo({x: 0, y: 0, animated: false});
            });
            setCurrentDay(day);
        }
    }

    const handleExerciseScroll = (event: any) => {
        const contentOffsetX = event.nativeEvent.contentOffset.x;
        const exercise = Math.min(Math.max(Math.ceil((contentOffsetX-195) / width), 0), program!.days[currentDay].exercises.length - 1);
        if (exercise !== currentExercise) {
            setCurrentExercise(exercise);
        }
    }

    useEffect(() => {
        Object.keys(exerciseScrollRefs.current).forEach((key) => {
            exerciseScrollRefs.current[parseInt(key)]?.scrollTo({x: 0, y: 0, animated: false});
        });
        dayScrollRef.current?.scrollTo({x: 0, y: 0, animated: false});
    }, [timesReset]);

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
          <ScrollView ref={dayScrollRef} snapToInterval={width} decelerationRate={'fast'} horizontal onScroll={handleDayScroll} pagingEnabled>
              {program.days.map((day, dayIndex) => (
                  <View key={dayIndex} style={{width}} className={'flex-1 flex-col justify-start items-center w-full gap-4 p-3'}>
                      <View className={'h-20'}>
                      <ScrollView horizontal contentContainerStyle={{alignItems: 'center', height: '100%'}}>
                        <Text className={`text-center text-6xl font-bold`} style={{color: day.color}}>{day.name}</Text>
                      </ScrollView>
                      </View>
                             {(day.exercises.length == 0) ?
                                 <View className={'flex-col h-full justify-center items-center'}>
                                     <Text className={'text-3xl'}>No Exercises in Day</Text>
                                 </View>
                                 :
                                 <>
                                     <Timer/>
                                     <Counter/>
                                     <ScrollView ref={(ref) => (exerciseScrollRefs.current[dayIndex] = ref)} horizontal snapToInterval={width} decelerationRate={'fast'} pagingEnabled onScroll={handleExerciseScroll}>
                                         {day.exercises.map((exercise, exerciseIndex) => (
                                             <View key={exerciseIndex} style={{width: width-20, marginRight: 20, padding: 3}}>
                                                 <ExerciseDisplay currentExercise={exerciseIndex} currentDay={dayIndex}/>
                                             </View>
                                         ))}
                                     </ScrollView>
                                 </>
                             }
                  </View>
                  ))}
          </ScrollView>

  );
}