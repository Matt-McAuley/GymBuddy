import {View, Text, Image, TouchableOpacity} from "react-native";
import exerciseInfoType from "@/types/exerciseInfoType";

export default function ExerciseDisplay(props: ExerciseDisplayProps) {
    const info = props.exerciseInfo;

    return (
        <View className={'flex-col justify-center items-center h-60 w-full bg-amber-50 border-4 border-black p-2 rounded-2xl'}>
            <Text className={'font-bold text-5xl'}>{info.currentExercise} : {info.currentWeight}</Text>
            <View className={'flex-row justify-between items-center w-full'}>
                <View className={'flex-col justify-center items-center w-40'}>
                    <TouchableOpacity onPress={() => {info.prevExerciseHandler}}>
                        <Image className={"h-18 w-18"}
                               source={require("@/assets/images/exerciseDisplay/leftArrow.png")}/>
                    </TouchableOpacity>
                    <Text className={'text-2xl'}>{info.prevExercise}</Text>
                    <Text className={'text-2xl'}>{info.prevWeight}</Text>
                </View>
                {/*<Text className={'border-4 p-3 text-4xl'}>5 x 5</Text>*/}
                <View className={'flex-col justify-center items-center w-40'}>
                    <TouchableOpacity onPress={() => {info.nextExerciseHandler}}>
                        <Image className={"h-18 w-18"}
                               source={require("@/assets/images/exerciseDisplay/rightArrow.png")}/>
                    </TouchableOpacity>
                    <Text className={'text-2xl'}>{info.nextExercise}</Text>
                    <Text className={'text-2xl'}>{info.nextWeight}</Text>
                </View>
            </View>
        </View>
    );
}

type ExerciseDisplayProps = {
    exerciseInfo: exerciseInfoType
}