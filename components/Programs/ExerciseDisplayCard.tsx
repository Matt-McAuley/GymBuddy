import {Text, TouchableOpacity, Image, View} from "react-native";
import {useProgramStore} from "@/store";

export default function ExerciseDisplayCard(props: ExerciseDisplayCardPropsType) {
    const exerciseName = props.exerciseName;
    const {setEditExercise} = useProgramStore();

    return (
        <View className={'w-full h-28 border-4 rounded-2xl mb-5 flex-row justify-between items-center'}>
            <Text className={`text-center w-80 text-4xl p-5 font-bold`}>{exerciseName}</Text>
            <View className={'flex-row justify-center items-center'}>
                <TouchableOpacity onPress={() => {setEditExercise(exerciseName)}}>
                    <Image className={'w-20 h-20 p-5'} source={require('@/assets/images/programs/edit.png')}/>
                </TouchableOpacity>
            </View>
        </View>
    );
}

type ExerciseDisplayCardPropsType = {
    exerciseName: string;
}