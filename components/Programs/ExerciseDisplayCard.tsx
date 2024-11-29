import {Text, TouchableOpacity, Image} from "react-native";

export default function ExerciseDisplayCard(props: ExerciseDisplayCardPropsType) {
    const exerciseName = props.exerciseName;

    return (
        <TouchableOpacity onPress={() => {}}
                          className={'w-full h-25 border-4 rounded-2xl mb-5 flex-row justify-around items-center'}>
            <Text className={'text-center text-6xl p-5 font-bold'}>{exerciseName}</Text>
            <TouchableOpacity>
                <Image className={'w-20 h-20 p-5'} source={require('@/assets/images/programs/edit.png')}/>
            </TouchableOpacity>
        </TouchableOpacity>
    );
}

type ExerciseDisplayCardPropsType = {
    exerciseName: string;
}