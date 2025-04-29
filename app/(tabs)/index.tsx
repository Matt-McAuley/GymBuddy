import {View, Text, ScrollView, Dimensions, AppState, StyleSheet} from "react-native";
import Timer from "@/components/Home/Timer";
import Counter from "@/components/Home/Counter";
import ExerciseDisplay from "@/components/Home/ExerciseDisplay";
import {useEffect, useRef, useState} from "react";
import {addMockProgram, dbSetup, dbTeardown, getProgram} from "@/db/dbFunctions";
import { Dropdown } from "react-native-element-dropdown";
import { useDrizzleStudio } from "expo-drizzle-studio-plugin";
import {useStore} from "@/store";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Index() {
    const {db, program, setProgram, currentDay, setCurrentDay, setCurrentExercise, timesReset, paused,
        setCurrentScheme, setSet, setRetrievedTime, currentExercise, setRetrievedPaused, setRetrievedYet, setRetrievedSet, time, setTime} = useStore();
    const day = program?.days[currentDay];
    const {width} = Dimensions.get('window');
    const exerciseScrollRefs = useRef<ScrollView | null >(null);
    const [backgroundStart, setBackgroundStart] = useState<number | null>(null);
    const appState = useRef(AppState.currentState);
    useDrizzleStudio(db);
    // console.log(program);
    // console.log(currentDay);
    // AsyncStorage.removeItem('currentDay');
    // AsyncStorage.getItem('currentDay').then((value) => {
    //     console.log('currentDay', value);
    // });

    useEffect(() => {
        const subscription = AppState.addEventListener('change', nextAppState => {
            if (appState.current.match(/inactive|background/) && nextAppState === 'active' && backgroundStart !== null && !paused) {
                setTime(time - Math.floor((new Date().getTime() - backgroundStart) / 1000));
            }
            else if (appState.current.match(/active/) && nextAppState === 'background') {
                setBackgroundStart(new Date().getTime());
            }
            appState.current = nextAppState;
        });

        return () => subscription.remove();
    }, [backgroundStart]);

    const retrieveOverwrittenValues = async () => {
        const timer = await AsyncStorage.getItem('timer');
        const initialTime = await AsyncStorage.getItem('initialTime');
        const startTime = await AsyncStorage.getItem('startTime');
        const newTime = (initialTime === null || startTime === null) ? (timer === null) ? null : parseInt(timer) :
            Math.max(1, parseInt(startTime) - Math.floor((new Date().getTime() - parseInt(initialTime)) / 1000));
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
        exerciseScrollRefs.current?.scrollTo({x: parseInt(day || '0') * width, y: 0, animated: false});
        setCurrentDay(parseInt(day || '0'));
        setCurrentExercise(parseInt(exercise || '0'));
        setCurrentScheme(scheme || '5 x 5');
    }

    useEffect(() => {
        // dbTeardown(db);
        // dbSetup(db);
        // addMockProgram(db);
        retrieveOverwrittenValues().then(() => {
            const program = getProgram(db);
            const dummyProgram = {
                name: 'Dummy Program',
                days: [
                    {
                        name: 'Day 1',
                        color: 'red',
                        exercises: [
                            {
                                name: 'Squat',
                                rest: 90,
                                weight_1: 100,
                                weight_2: 105,
                                weight_3: 110,
                                reps_1: 5,
                                reps_2: 5,
                                reps_3: 5
                            },
                        ]
                    }
                ]
            }
            setProgram((program === null) ? dummyProgram : program);
            setProgram(getProgram(db));
            retrieveOtherValues().then(() => {
                setRetrievedYet(true);
            });
        });
    }, []);

    const handleExerciseScroll = (event: any) => {
        const contentOffsetX = event.nativeEvent.contentOffset.x;
        const exercise = Math.min(Math.max(Math.ceil((contentOffsetX-195) / width), 0), program!.days[currentDay].exercises.length - 1);
        if (exercise !== currentExercise) {
            setCurrentExercise(exercise);
        }
    }

    useEffect(() => {
        exerciseScrollRefs.current?.scrollTo({x: 0, y: 0, animated: false});
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
          <>
          <View className={'flex justify-center items-center'}>
            <Dropdown style={styles.dropdown} selectedTextStyle={{...styles.selected, color:day?.color.toLowerCase()}}
                  label={'day'}
                  data={program.days.map((d, index) => ({label: d.name, value: index}))}
                  labelField='label' valueField='value'
                  value={currentDay}
                  renderItem={(item, index) => (
                <View style={styles.item}>
                    <Text style={{...styles.itemText, color: program?.days[index].color}}>{item.label}</Text>
                </View>)}
                  onChange={(item) => {setCurrentDay(item.value)}}/>
          </View>
              <View style={{width}} className={'flex-1 flex-col justify-start items-center w-full gap-4 p-3'}>
                     {(day?.exercises.length == 0) ?
                         <View className={'flex-col h-full justify-center items-center'}>
                             <Text className={'text-3xl'}>No Exercises in Day</Text>
                         </View>
                         :
                         <>
                             <Timer/>
                             <Counter/>
                             <ScrollView ref={(ref) => (exerciseScrollRefs.current = ref)} horizontal snapToInterval={width}
                                         decelerationRate={'fast'} pagingEnabled onScroll={handleExerciseScroll}>
                                 {day?.exercises.map((exercise, exerciseIndex) => (
                                     <View key={exerciseIndex} style={{width: width-20, marginRight: 20, padding: 3}}>
                                         <ExerciseDisplay currentExercise={exerciseIndex} currentDay={currentDay}/>
                                     </View>
                                 ))}
                             </ScrollView>
                         </>
                     }
              </View>
          </>
  );
}

const styles = StyleSheet.create({
    dropdown: {
        height: 80,
        padding: 10,
        width: '70%',
    },
    selected: {
        color: 'black',
        textAlign: 'center',
        fontSize: 50,
        fontWeight: 'bold',
    },
    item: {
        padding: 10,
        height: 60,
        width: '100%',
        borderBottomWidth: 2,
        borderBottomColor: 'gray',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    itemText: {
        fontSize: 30,
        color: 'black',
        fontWeight: 'bold',
    },
});