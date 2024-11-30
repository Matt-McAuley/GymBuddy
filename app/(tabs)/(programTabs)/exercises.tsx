import {Text, ScrollView, TouchableOpacity, View} from "react-native";
import {useProgramStore, useStore} from "@/store";
import {getExerciseNames} from "@/db/programDBFunctions";
import ExerciseDisplayCard from "@/components/Programs/ExerciseDisplayCard";
import {useEffect} from "react";

export default function Exercises() {
    const {db} = useStore();
    const exerciseNames = getExerciseNames(db);
    const {setAddProgramForm, setAddExerciseForm, setAddDayForm, setEditProgramForm, setEditExerciseForm, setEditDayForm} = useProgramStore();

    return (
        <ScrollView className={'p-4'}>
            {exerciseNames.map((exerciseName) =>
                <View key={exerciseName}>
                    <ExerciseDisplayCard exerciseName={exerciseName}/>
                </View>
            )}
            <TouchableOpacity className={'w-full h-25 border-4 border-dashed border-gray-500 rounded-2xl mb-5 flex-row justify-around items-center'}>
                <Text className={'text-4xl text-center font-bold color-gray-500'}>Add New Day</Text>
            </TouchableOpacity>
        </ScrollView>
    );
}