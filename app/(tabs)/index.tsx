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
    const exerciseScrollRef = useRef<ScrollView | null >(null);
    const [backgroundStart, setBackgroundStart] = useState<number | null>(null);
    const appState = useRef(AppState.currentState);
    useDrizzleStudio(db);

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
        exerciseScrollRef.current?.scrollTo({x: parseInt(exercise || '0') * width, y: 0, animated: false});
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

    const handleExerciseScroll = (event: any) => {
        const contentOffsetX = event.nativeEvent.contentOffset.x;
        const exercise = Math.min(Math.max(Math.ceil((contentOffsetX-195) / width), 0), program!.days[currentDay].exercises.length - 1);
        if (exercise !== currentExercise) {
            setCurrentExercise(exercise);
        }
    }

    useEffect(() => {
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
                <>
                    <View className={'flex justify-center items-center'}>
                        <Dropdown style={styles.dropdown} selectedTextStyle={{...styles.selected, color:day?.color}}
                                  data={program.days.map((d, index) => ({label: d.name, value: {index, color: d.color}}))}
                                  labelField='label' valueField='value' value={{label: day?.name, value: {index: currentDay, color: day?.color}}}
                                  renderRightIcon={() => (
                                      <Text style={{...styles.icon, color: 'black'}}>{'▼'}</Text>
                                  )}
                                  renderItem={(item, selected) => (
                                      (selected) ? null :
                                          <View style={styles.item}>
                                              <Text style={{...styles.itemText, color: item.value.color}}>{item.label}</Text>
                                          </View>)}
                                  onChange={(item) => {setCurrentDay(item.value.index)}}/>
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
                                <ScrollView ref={(ref) => (exerciseScrollRef.current = ref)} horizontal snapToInterval={width}
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
        height: 60,
        width: '90%',
        display: 'flex',
        backgroundColor: 'white',
        borderRadius: 8,
        borderWidth: 1,
        margin: 10,
        padding: 10,

    },
    selected: {
        textAlign: 'center',
        fontSize: 30,
        fontWeight: 'bold',
    },
    icon: {
        marginLeft: 5,
        fontSize: 20,
        fontWeight: 'bold',
    },
    item: {
        padding: 10,
        height: 60,
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