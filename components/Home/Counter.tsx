import {Image, ScrollView, Text, TouchableOpacity, View} from "react-native";
import {useEffect, useState} from "react";
import { useStore } from "@/store";

export default function Counter() {
    const {isSuperSet, set, setSet, retrievedSet, setRetrievedSet, retrievedYet} = useStore();
    const exercise = useStore((state) => state.exercise());

    const getMaxSets = () => {
        return (isSuperSet(exercise)) ? Math.max(
            exercise.exercise1.sets.length-1, exercise.exercise2.sets.length-1) : exercise.sets.length-1;
    }

    const superSetOneExericse = () => {
        if (!isSuperSet(exercise)) return -1;
        if (set < exercise.exercise1.sets.length && set < exercise.exercise2.sets.length) return -1;
        if (set < exercise.exercise1.sets.length && set > exercise.exercise2.sets.length) return 0;
        if (set > exercise.exercise1.sets.length && set < exercise.exercise2.sets.length) return 1;
    }

    const getReps = () => {
        if (isSuperSet(exercise)) {
            if (superSetOneExericse() == -1) {
                return [exercise.exercise1.sets[set].reps, exercise.exercise2.sets[set].reps];
            }
            return [exercise.exercise1.sets[0].reps, exercise.exercise2.sets[0].reps];
        }
        if (set < exercise.sets.length) {
            return [exercise.sets[set].reps];
        }
        return [exercise.sets[0].reps];
    }
    const [reps, setReps] = useState(getReps());
    const [maxSets, setMaxSets] = useState(getMaxSets());

    useEffect(() => {
        setMaxSets(getMaxSets());
        setReps(getReps());
        setSet(0);
    }, [exercise]);

    useEffect(() => {
        setReps(getReps());
    }, [set]);

    useEffect(() => {
        if (retrievedYet && retrievedSet) {
            setSet(retrievedSet);
            setRetrievedSet(null);
        }
    }, [retrievedYet]);

    return (
        <View className={'flex-row justify-center items-center h-35 w-full bg-amber-50 border-4 border-black p-2 rounded-2xl'}>
            <View className={'border-r-4 flex-row justify-between items-center w-53 p-2 h-35'}>
                <Text className={'text-4xl font-bold mr-3'}>Set:</Text>
                <View className={'flex-col justify-center items-center'}>
                    <Text className={'text-3xl m-0 p-0 border-b-2 w-9 text-center'}>{set+1}</Text>
                    <Text className={'text-3xl m-0 p-0'}>{maxSets+1}</Text>
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
                <Text className={'text-4xl font-bold ml-2'}>Reps:</Text>
                <Text className={'text-3xl text-left min-w-8'}>{reps[0]}</Text>
            </View>
                :
            <View className={'flex-row justify-between items-center w-42 p-3'}>
                <Text className={'text-4xl font-bold ml-2'}>Reps:</Text>
                <View>
                    {(superSetOneExericse() == -1) ? 
                        <>
                            <Text className={'text-3xl text-center min-w-8'}>{reps[0]}</Text>
                            <Text className={'text-3xl text-center min-w-8'}>{reps[1]}</Text>
                        </>
                    : (superSetOneExericse() == 0) ?
                        <>
                            <Text className={'text-3xl text-center min-w-8'}>{reps[0]}</Text>
                        </>
                    : 
                        <>
                            <Text className={'text-3xl text-center min-w-8'}>{reps[1]}</Text>
                        </>
                    }
                </View>
            </View>
            }
        </View>
    );
}