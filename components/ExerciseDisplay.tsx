import {View, Text, Image, TouchableOpacity} from "react-native";
import exerciseInfoType from "@/types/exerciseInfoType";
import {useStore} from "@/store";

export default function ExerciseDisplay() {
    const info = useStore((state) => state.exerciseInfo);
    const set = useStore((state) => state.set);
    const nextExerciseHandler = useStore((state) => state.nextExerciseHandler);
    const prevExerciseHandler = useStore((state) => state.prevExerciseHandler);

    return (
        <View className={'flex-col justify-center items-center h-60 w-full bg-amber-50 border-4 border-black p-2 rounded-2xl'}>
            <Text className={'font-bold text-5xl'}>{info.currentExercise} : {info.currentWeight[set-1]}</Text>
            <View className={'flex-row justify-between items-center w-full'}>
                <View className={'flex-col justify-center items-center w-40'}>
                    <TouchableOpacity onPress={prevExerciseHandler}>
                        <Image className={"h-18 w-18"}
                               source={require("@/assets/images/exerciseDisplay/leftArrow.png")}/>
                    </TouchableOpacity>
                    <Text className={'text-2xl'}>{info.prevExercise}</Text>
                    <Text className={'text-2xl'}>{info.prevWeight}</Text>
                </View>
                {/*<Text className={'border-4 p-3 text-4xl'}>5 x 5</Text>*/}
                <View className={'flex-col justify-center items-center w-40'}>
                    <TouchableOpacity onPress={nextExerciseHandler}>
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