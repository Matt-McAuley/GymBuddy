import {View, Text} from "react-native";
import {useStore} from "@/store";
import {exerciseType, superSetType} from "@/types/programType";

export default function ExerciseDisplay(props: superSetExercisePropsType) {
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
        <View className={'flex-col justify-between items-center h-68 w-full bg-amber-50 border-4 border-black p-5 rounded-2xl'}>
            <View className={'flex-col justify-center items-center'}>
                <Text className={'font-bold text-4xl -mt-2'}>{exercise.exercise1.name}</Text>
                <Text className={'font-bold text-4xl mb-4'}>{exercise.exercise2.name}</Text>
                <View className={'flex-row justify-center items-center mb-2'}>
                    <Text className={'text-3xl flex-1 text-center'}>{(set < exercise.exercise1.sets.length) ? exercise.exercise1.sets[set].weight : exercise.exercise1.sets[0].weight} lbs</Text>
                    <Text className={'text-3xl'}> & </Text>
                    <Text className={'text-3xl flex-1 text-center'}>{(set < exercise.exercise2.sets.length) ? exercise.exercise2.sets[set].weight : exercise.exercise2.sets[0].weight} lbs</Text>
                </View>
            </View>
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

type superSetExercisePropsType = {
    exercise: superSetType;
    nextExercise: exerciseType | superSetType | null;
    prevExercise: exerciseType | superSetType | null;
}