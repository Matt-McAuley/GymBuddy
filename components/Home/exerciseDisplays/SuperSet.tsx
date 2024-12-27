import {View, Text} from "react-native";
import {useStore} from "@/store";
import {accessoryExerciseType, primaryExerciseType, superSetType} from "@/types/programType";

export default function ExerciseDisplay(props: superSetExercisePropsType) {
    const {isAccessoryExercise, isPrimaryExercise} = useStore();
    const {exercise, nextExercise, prevExercise} = props;

    const superSetNameDisplay = (superSet : superSetType) => {
        return superSet.exercise1.name.split(' ').map((s) => s[0]).join('') + ' & '
            + superSet.exercise2.name.split(' ').map((s) => s[0]).join('');
    }

    const superSetWeightDisplay = (superSet : superSetType) => {
        return superSet.exercise1.weight + ' | ' + superSet.exercise2.weight;
    }

    return (
        <View className={'flex-col justify-between items-center h-60 w-full bg-amber-50 border-4 border-black p-7 rounded-2xl'}>
            <View className={'flex-col justify-center items-center'}>
                <Text className={'font-bold text-4xl'}>{exercise.exercise1.name} : {exercise.exercise1.weight}</Text>
                <Text className={'font-bold text-4xl'}>{exercise.exercise2.name} : {exercise.exercise2.weight}</Text>
            </View>
            <View className={'flex-row justify-between items-center w-full'}>
                <View className={'flex-col justify-center items-center'}>
                    <Text className={'text-2xl'}>{(prevExercise == null) ? 'None' : (isPrimaryExercise(prevExercise)) ?
                        prevExercise.name : (isAccessoryExercise(prevExercise)) ? prevExercise.name : superSetNameDisplay(prevExercise)}</Text>
                    <Text className={'text-2xl'}>{(prevExercise == null) ? 'X' : (isPrimaryExercise(prevExercise)) ?
                        prevExercise.weight_1: (isAccessoryExercise(prevExercise)) ? prevExercise.weight : superSetWeightDisplay(prevExercise)}</Text>
                </View>
                <View className={'flex-col justify-center items-center'}>
                    <Text className={'text-2xl'}>{(nextExercise == null) ? 'None' : (isPrimaryExercise(nextExercise)) ?
                        nextExercise.name : (isAccessoryExercise(nextExercise)) ? nextExercise.name : superSetNameDisplay(nextExercise)}</Text>
                    <Text className={'text-2xl'}>{(nextExercise == null) ? 'X' : (isPrimaryExercise(nextExercise)) ?
                        nextExercise.weight_1: (isAccessoryExercise(nextExercise)) ? nextExercise.weight : superSetWeightDisplay(nextExercise)}</Text>
                </View>
            </View>
        </View>
    );
}

type superSetExercisePropsType = {
    exercise: superSetType;
    nextExercise: primaryExerciseType | accessoryExerciseType | superSetType | null;
    prevExercise: primaryExerciseType | accessoryExerciseType | superSetType | null;
}