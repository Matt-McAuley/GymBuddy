import {Image, Text, TouchableOpacity, View} from "react-native";
import {useEffect, useState} from "react";
import { useStore } from "@/store";

export default function Counter() {
    const {isAccessoryExercise, isPrimaryExercise, isSuperSet, exercise} = useStore();
    const [sets, setSets] = useState((isPrimaryExercise(exercise)) ? exercise.sets : (isAccessoryExercise(exercise))
        ? exercise.sets : (isSuperSet(exercise)) ? exercise.exercise1.sets : 0);
    const [reps, setReps] = useState((isPrimaryExercise(exercise))
        ? [exercise.reps_1, exercise.reps_2, exercise.reps_3, exercise.reps_2, exercise.reps_1]
        : (isAccessoryExercise(exercise)) ? new Array(5).fill(exercise.reps)
            : (isSuperSet(exercise)) ? new Array(5).fill(exercise.exercise1.reps + '|' + exercise.exercise2.reps) : []);
    const set = useStore((state) => state.set);
    const setSet = useStore((state) => state.setSet);


    useEffect(() => {
        setSets((isPrimaryExercise(exercise)) ? exercise.sets : (isAccessoryExercise(exercise))
            ? exercise.sets : (isSuperSet(exercise)) ? exercise.exercise1.sets : 0);
        setReps((isPrimaryExercise(exercise))
            ? [exercise.reps_1, exercise.reps_2, exercise.reps_3, exercise.reps_2, exercise.reps_1]
            : (isAccessoryExercise(exercise)) ? new Array(5).fill(exercise.reps)
                : (isSuperSet(exercise)) ? new Array(5).fill(exercise.exercise1.reps + '|' + exercise.exercise2.reps) : []);
        setSet(1);
    }, [exercise]);

    return (
        <View className={'flex-row justify-center items-center h-35 w-full bg-amber-50 border-4 border-black p-2 rounded-2xl'}>
            <View className={'border-r-4 flex-row justify-between items-center w-56 p-3 h-35'}>
                <Text className={'text-4xl font-bold mr-3'}>Set:</Text>
                <View className={'flex-col justify-center items-center'}>
                    <Text className={'text-4xl font-bold m-0 p-0 border-b-4 w-9 text-center'}>{set}</Text>
                    <Text className={'text-4xl font-bold m-0 p-0'}>{sets}</Text>
                </View>
                <View className={''}>
                    <TouchableOpacity onPress={() => {setSet(Math.min(sets, set+1))}}>
                        <Image className={"h-15 w-15"} source={require("@/assets/images/counter/upArrow.png")}/>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => {setSet(Math.max(1, set-1))}}>
                        <Image className={"h-15 w-15"} source={require("@/assets/images/counter/downArrow.png")}/>
                    </TouchableOpacity>
                </View>
            </View>
            <View className={'flex-row justify-between items-center w-42 p-3'}>
                <Text className={'text-4xl font-bold'}>Reps:</Text>
                <Text className={'text-4xl font-bold'}>{reps[set-1]}</Text>
            </View>
        </View>
    );
}