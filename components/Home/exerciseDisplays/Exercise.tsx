import {View, Text} from "react-native";
import {useStore} from "@/store";
import {exerciseType, superSetType} from "@/types/programType";

export default function Exercise(props: exercisePropsType) {
    const { set, isSuperSet } = useStore();
    const { exercise, nextExercise, prevExercise } = props;

    const superSetNameDisplay = (superSet : superSetType) => {
        return superSet.exercise1.name.split(' ').map((s) => s[0]).join('') + ' & '
            + superSet.exercise2.name.split(' ').map((s) => s[0]).join('');
    }

    const superSetWeightDisplay = (superSet : superSetType) => {
        return superSet.exercise1.sets[set].weight + ' | ' + superSet.exercise2.sets[set].weight;
    }

    return (
        <View className={'flex-col justify-between items-center h-60 w-full bg-amber-50 border-4 border-black p-7 rounded-2xl'}>
            <Text className={'font-bold text-4xl'}>{exercise.name} : {exercise.sets[set].weight}</Text>
            <View className={'flex-row justify-between items-center w-full'}>
                <View className={'flex-col justify-center items-center'}>
                    <Text className={'text-2xl'}>{(prevExercise == null) ? ' ' : (isSuperSet(prevExercise)) ? 
                        superSetNameDisplay(prevExercise) : prevExercise.name}</Text>
                    <Text className={'text-2xl'}>{(prevExercise == null) ? ' ' : (isSuperSet(prevExercise)) ? 
                        superSetWeightDisplay(prevExercise) : prevExercise.sets[set].weight}</Text>
                </View>
                <View className={'flex-col justify-center items-center'}>
                    <Text className={'text-2xl'}>{(nextExercise == null) ? ' ' : (isSuperSet(nextExercise)) ? 
                        superSetNameDisplay(nextExercise) : nextExercise.name}</Text>
                    <Text className={'text-2xl'}>{(nextExercise == null) ? ' ' : (isSuperSet(nextExercise)) ? 
                        superSetWeightDisplay(nextExercise) : nextExercise.sets[set].weight}</Text>
                </View>
            </View>
        </View>
    );
}

type exercisePropsType = {
    exercise: exerciseType;
    nextExercise: exerciseType | superSetType | null;
    prevExercise: exerciseType | superSetType | null;
}