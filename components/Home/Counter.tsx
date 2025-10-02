import {Image, ScrollView, Text, TouchableOpacity, View} from "react-native";
import {useEffect, useState} from "react";
import { useStore } from "@/store";

export default function Counter() {
    const {isSuperSet, currentScheme, set, setSet, retrievedSet, setRetrievedSet, retrievedYet} = useStore();
    const exercise = useStore((state) => state.exercise());
    const [maxSets, setMaxSets] = useState((isSuperSet(exercise)) ? Math.min(
        exercise.exercise1.sets.length-1, exercise.exercise2.sets.length-1) : exercise.sets.length-1);

    const getReps = () => {
        if (isSuperSet(exercise)) {
            if (set < exercise.exercise1.sets.length && set < exercise.exercise2.sets.length) {
                return Math.max(exercise.exercise1.sets[set].reps, exercise.exercise2.sets[set].reps);
            }
            return Math.max(exercise.exercise1.sets[0].reps, exercise.exercise2.sets[0].reps);
        }
        if (set < exercise.sets.length) {
            return exercise.sets[set].reps;
        }
        return exercise.sets[0].reps;
    }
    const [reps, setReps] = useState(getReps());

    useEffect(() => {
        setMaxSets((isSuperSet(exercise)) ? Math.min(
        exercise.exercise1.sets.length-1, exercise.exercise2.sets.length-1) : exercise.sets.length-1);
        setReps(getReps());
        setSet(0);
    }, [exercise]);

    useEffect(() => {
        if (retrievedYet && retrievedSet) {
            setSet(retrievedSet);
            setRetrievedSet(null);
        }
    }, [retrievedYet]);

    useEffect(() => {
        setReps(getReps());
    }, [currentScheme]);

    return (
        <View className={'flex-row justify-center items-center h-35 w-full bg-amber-50 border-4 border-black p-2 rounded-2xl'}>
            <View className={'border-r-4 flex-row justify-between items-center w-53 p-2 h-35'}>
                <Text className={'text-4xl font-bold mr-3'}>Set:</Text>
                <View className={'flex-col justify-center items-center'}>
                    <Text className={'text-3xl font-bold m-0 p-0 border-b-4 w-9 text-center'}>{set+1}</Text>
                    <Text className={'text-3xl font-bold m-0 p-0'}>{maxSets+1}</Text>
                </View>
                <View className={''}>
                    <TouchableOpacity onPress={() => {setSet(Math.min(maxSets, set+1))}}>
                        <Image className={"h-15 w-15"} source={require("@/assets/images/counter/upArrow.png")}/>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => {setSet(Math.max(0, set-1))}}>
                        <Image className={"h-15 w-15"} source={require("@/assets/images/counter/downArrow.png")}/>
                    </TouchableOpacity>
                </View>
            </View>
            {(!isSuperSet(exercise)) ?
            <View className={'flex-row justify-between items-center w-42 p-3'}>
                <Text className={'text-4xl font-bold mr-2'}>Reps:</Text>
                <ScrollView horizontal>
                    <Text className={'text-3xl font-bold'}>{reps}</Text>
                </ScrollView>
            </View>
                :
            <View className={'flex-row justify-between items-center w-42 p-3'}>
                <Text className={'text-4xl font-bold'}>Reps:</Text>
                <View>
                    <Text className={'text-3xl font-bold '}>{reps}</Text>
                    <Text className={'text-3xl font-bold'}>{reps}</Text>
                </View>
            </View>
            }
        </View>
    );
}