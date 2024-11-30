import {Text, ScrollView, TouchableOpacity, View} from "react-native";
import {useProgramStore, useStore} from "@/store";
import {getExerciseNames} from "@/db/programDBFunctions";
import DayDisplayCard from "@/components/Programs/DayDisplayCard";
import AddExercise from "@/components/Programs/Forms/AddExercise";
import EditExercise from "@/components/Programs/Forms/EditExercise";
import ExerciseDisplayCard from "@/components/Programs/ExerciseDisplayCard";

export default function Exercises() {
    const {db} = useStore();
    const {addExerciseForm, editExercise, setAddExerciseForm, setEditExercise} = useProgramStore();
    const exerciseNames = getExerciseNames(db);

    return (
        (addExerciseForm) ?
            <AddExercise/>
            :
            (editExercise != null) ?
                <EditExercise />
                :
                <ScrollView className={'p-4'}>
                    {exerciseNames.map((exercise) =>
                        <View key={exercise}>
                            <ExerciseDisplayCard exerciseName={exercise} />
                        </View>
                    )}
                    <TouchableOpacity onPress={() => setAddExerciseForm(true)}
                                      className={'w-full h-25 border-4 border-dashed border-gray-500 rounded-2xl mb-5 flex-row justify-around items-center'}>
                        <Text className={'text-4xl text-center font-bold color-gray-500'}>Add New Exercise</Text>
                    </TouchableOpacity>
                </ScrollView>
    );
}