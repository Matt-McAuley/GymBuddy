import {View, Text, ScrollView, Dimensions, AppState, StyleSheet, TouchableOpacity} from "react-native";
import Timer from "@/components/Home/Timer";
import Counter from "@/components/Home/Counter";
import ExerciseDisplay from "@/components/Home/ExerciseDisplay";
import {useEffect, useRef, useState} from "react";
import {addMockProgram, dbSetup, dbTeardown, getProgram} from "@/db/dbFunctions";
import { Dropdown } from "react-native-element-dropdown";
import { useDrizzleStudio } from "expo-drizzle-studio-plugin";
import {useStore} from "@/store";
import AsyncStorage from "@react-native-async-storage/async-storage";
import BottomSheet, { BottomSheetFlatList } from "@gorhom/bottom-sheet";

export default function Index() {
    const {db, program, setProgram, currentDay, setCurrentDay, setCurrentExercise, timesReset,
        setCurrentScheme, currentExercise, setRetrievedYet, setRetrievedSet} = useStore();
    const day = program?.days[currentDay];
    const {width} = Dimensions.get('window');
    const exerciseScrollRef = useRef<ScrollView | null >(null);
    const dayBottomSheetRef = useRef<BottomSheet>(null);
    const [sheetOpen, setSheetOpen] = useState(false);
    useDrizzleStudio(db);

    const openSheet = (sheetRef: React.RefObject<BottomSheet>) => {
        sheetRef.current?.snapToIndex(0);
        setSheetOpen(true);
    }
    const closeSheet = (sheetRef: React.RefObject<BottomSheet>) => {
        sheetRef.current?.close();
        setSheetOpen(false);
    }

    const retrieveOverwrittenValues = async () => {
        const set = await AsyncStorage.getItem('set');
        setRetrievedSet(parseInt(set || '0'));
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
        dbTeardown(db);
        dbSetup(db);
        addMockProgram(db);
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

    const handleDayChange = (index: number) => {
        exerciseScrollRef.current?.scrollTo({x: 0, y: 0, animated: false});
        setCurrentDay(index);
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
                        <TouchableOpacity 
                            style={{...styles.dropdown, borderWidth: 3}}
                            onPress={() => openSheet(dayBottomSheetRef)}>
                            <Text style={{...styles.selected, color: day?.color}}>
                                {day?.name}
                            </Text>
                        </TouchableOpacity>
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
                    {(sheetOpen) && (
                        <TouchableOpacity 
                            style={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                right: 0,
                                bottom: 0,
                                backgroundColor: 'rgba(0,0,0,0.25)',
                            }}
                            activeOpacity={1}
                            onPress={() => {
                                closeSheet(dayBottomSheetRef);
                            }}
                        />
                    )}
                    <BottomSheet ref={dayBottomSheetRef} index={-1} snapPoints={["50%"]} enableDynamicSizing={false} enableOverDrag={true}>
                        <BottomSheetFlatList 
                            data={program.days} 
                            renderItem={({item, index}) => (
                                <TouchableOpacity onPress={() => {
                                    handleDayChange(index);
                                    closeSheet(dayBottomSheetRef);
                                }}>
                                    <Text style={{...styles.itemText, color: item.color.toLowerCase(), padding: 20, textAlign: 'center'}}>
                                        {item.name}
                                    </Text>
                                </TouchableOpacity>
                            )} 
                            keyExtractor={(_, index) => index.toString()}
                        />
                    </BottomSheet>
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
        justifyContent: 'center',
        alignItems: 'center',
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