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
        return superSet.exercise1.sets[0].weight + ' | ' + superSet.exercise2.sets[0].weight;
    }

    return (
        <View className={'flex-col justify-between items-center h-60 w-full bg-amber-50 border-4 border-black p-5 rounded-2xl'}>
            <Text className={'font-bold text-4xl -mb-12'}>{exercise.name}</Text>
            <Text className={'text-3xl'}>{(set < exercise.sets.length) ? exercise.sets[set].weight : exercise.sets[0].weight} lbs</Text>
            <View className={'flex-row justify-between items-center w-full'}>
                <View className={'flex-col justify-center items-center'}>
                    <Text className={'text-xl'}>{(prevExercise == null) ? ' ' : (isSuperSet(prevExercise)) ? 
                        superSetNameDisplay(prevExercise) : prevExercise.name}</Text>
                    <Text className={'text-xl'}>{(prevExercise == null) ? ' ' : (isSuperSet(prevExercise)) ? 
                        superSetWeightDisplay(prevExercise) : prevExercise.sets[0].weight}</Text>
                </View>
                <View className={'flex-col justify-center items-center'}>
                    <Text className={'text-xl'}>{(nextExercise == null) ? ' ' : (isSuperSet(nextExercise)) ? 
                        superSetNameDisplay(nextExercise) : nextExercise.name}</Text>
                    <Text className={'text-xl'}>{(nextExercise == null) ? ' ' : (isSuperSet(nextExercise)) ? 
                        superSetWeightDisplay(nextExercise) : nextExercise.sets[0].weight}</Text>
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