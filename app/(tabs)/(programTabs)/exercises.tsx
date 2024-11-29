import {Text, ScrollView, TouchableOpacity} from "react-native";
import {useStore} from "@/store";
import {getExerciseNames} from "@/db/programDBFunctions";
import ExerciseDisplayCard from "@/components/ExerciseDisplayCard";

export default function Exercises() {
    const {db} = useStore();
    const exerciseNames = getExerciseNames(db);

    return (
        <ScrollView className={'p-4'}>
            {exerciseNames.map((exerciseName) => <ExerciseDisplayCard key={exerciseName} exerciseName={exerciseName}/>)}
            <TouchableOpacity className={'w-full h-25 border-4 border-dashed border-gray-500 rounded-2xl mb-5 flex-row justify-around items-center'}>
                <Text className={'text-4xl text-center font-bold color-gray-500'}>Add New Day</Text>
            </TouchableOpacity>
        </ScrollView>
    );
}