import {View, Text, ScrollView, Dimensions} from "react-native";
import Timer from "@/components/Home/Timer";
import Counter from "@/components/Home/Counter";
import ExerciseDisplay from "@/components/Home/ExerciseDisplay";
import {useEffect, useRef} from "react";
import {addMockProgram, dbSetup, dbTeardown, getProgram} from "@/db/dbFunctions";
import { useDrizzleStudio } from "expo-drizzle-studio-plugin";
import {useStore} from "@/store";

export default function Index() {
    const {db, program, setProgram, currentDay, setCurrentDay, setCurrentExercise, timesReset} = useStore();
    const {width} = Dimensions.get('window');
    const dayScrollRef = useRef<ScrollView | null>(null);
    const exerciseScrollRef = useRef<ScrollView | null>(null);
    useDrizzleStudio(db);

    useEffect(() => {
        // dbTeardown(db);
        // dbSetup(db);
        // addMockProgram(db);
        setProgram(getProgram(db));
    }, []);

    useEffect(() => {
        if (program == null) return;
        if (program.days.length == 0) return;
    }, [currentDay]);

    const handleDayScroll = (event: any) => {
        const contentOffsetX = event.nativeEvent.contentOffset.x;
        const day = Math.min(Math.max(Math.ceil((contentOffsetX-195) / width), 0), program!.days.length - 1);
        setCurrentDay(day);
    }

    const handleExerciseScroll = (event: any) => {
        const contentOffsetX = event.nativeEvent.contentOffset.x;
        const exercise = Math.min(Math.max(Math.ceil((contentOffsetX-195) / width), 0), program!.days[currentDay].exercises.length - 1);
        setCurrentExercise(exercise);
    }

    useEffect(() => {
        dayScrollRef.current?.scrollTo({x: currentDay * width, y: 0, animated: false});
        exerciseScrollRef.current?.scrollTo({x: 0, y: 0, animated: false});
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
                                     <ScrollView ref={exerciseScrollRef} horizontal snapToInterval={width} decelerationRate={'fast'} pagingEnabled onScroll={handleExerciseScroll}>
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