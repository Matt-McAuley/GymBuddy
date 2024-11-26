import {View, Text, Image, TouchableOpacity} from "react-native";
import {useStore} from "@/store";

export default function ExerciseDisplay() {
    const {set, nextExerciseHandler, prevExerciseHandler, isAccessoryExercise,
        isPrimaryExercise, isSuperSet, program} = useStore();
    const exercise = useStore((state) => state.exercise());
    const prevExercise = useStore((state) => state.prevExercise());
    const nextExercise = useStore((state) => state.nextExercise());

    return (isPrimaryExercise(exercise)) ? (
        <View className={'flex-col justify-center items-center h-60 w-full bg-amber-50 border-4 border-black p-2 rounded-2xl'}>
            <Text className={'font-bold text-5xl'}>{exercise.name} : {[exercise.weight_1, exercise.weight_2, exercise.weight_3, exercise.weight_2, exercise.weight_1][set-1]}</Text>
            <View className={'flex-row justify-between items-center w-full'}>
                <View className={'flex-col justify-center items-center w-40'}>
                    <TouchableOpacity onPress={prevExerciseHandler}>
                        <Image className={"h-18 w-18"}
                               source={require("@/assets/images/exerciseDisplay/leftArrow.png")}/>
                    </TouchableOpacity>
                    <Text className={'text-2xl'}>{(prevExercise == null) ? 'None' : (isPrimaryExercise(prevExercise)) ?
                    prevExercise.name : (isAccessoryExercise(prevExercise)) ? prevExercise.name : prevExercise.exercise1.name + ' | ' + prevExercise.exercise2.name}</Text>
                    <Text className={'text-2xl'}>{(prevExercise == null) ? 'X' : (isPrimaryExercise(prevExercise)) ?
                        prevExercise.weight_1: (isAccessoryExercise(prevExercise)) ? prevExercise.weight : prevExercise.exercise1.weight + ' | ' + prevExercise.exercise2.weight}</Text>
                </View>
                {/*<Text className={'border-4 p-3 text-4xl'}>5 x 5</Text>*/}
                <View className={'flex-col justify-center items-center w-40'}>
                    <TouchableOpacity onPress={nextExerciseHandler}>
                        <Image className={"h-18 w-18"}
                               source={require("@/assets/images/exerciseDisplay/rightArrow.png")}/>
                    </TouchableOpacity>
                    <Text className={'text-2xl'}>{(nextExercise == null) ? 'None' : (isPrimaryExercise(nextExercise)) ?
                        nextExercise.name : (isAccessoryExercise(nextExercise)) ? nextExercise.name : nextExercise.exercise1.name + ' | ' + nextExercise.exercise2.name}</Text>
                    <Text className={'text-2xl'}>{(nextExercise == null) ? 'X' : (isPrimaryExercise(nextExercise)) ?
                        nextExercise.weight_1: (isAccessoryExercise(nextExercise)) ? nextExercise.weight : nextExercise.exercise1.weight + ' | ' + nextExercise.exercise2.weight}</Text>
                </View>
            </View>
        </View>

    ) : (isAccessoryExercise(exercise)) ? (
        <View></View>

    ) : (isSuperSet(exercise)) ? (
        <View></View>

    ) : null;
}