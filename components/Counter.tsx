import {Image, Text, TouchableOpacity, View} from "react-native";
import {useEffect, useState} from "react";

export default function Counter(props: counterPropsType) {
    const [set, setSet] = useState(1);

    useEffect(() => {
        setSet(1);
    }, [props])

    return (
        <View className={'flex-row justify-center items-center h-35 w-full bg-amber-50 border-4 border-black p-2 rounded-2xl'}>
            <View className={'border-r-4 flex-row justify-between items-center w-56 p-3 h-35'}>
                <Text className={'text-4xl font-bold mr-3'}>Set:</Text>
                <View className={'flex-col justify-center items-center'}>
                    <Text className={'text-4xl font-bold m-0 p-0 border-b-4 w-9 text-center'}>{set}</Text>
                    <Text className={'text-4xl font-bold m-0 p-0'}>{props.sets}</Text>
                </View>
                <View className={''}>
                    <TouchableOpacity onPress={() => {setSet(Math.min(props.sets, set+1))}}>
                        <Image className={"h-15 w-15"} source={require("@/assets/images/counter/upArrow.png")}/>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => {setSet(Math.max(1, set-1))}}>
                        <Image className={"h-15 w-15"} source={require("@/assets/images/counter/downArrow.png")}/>
                    </TouchableOpacity>
                </View>
            </View>
            <View className={'flex-row justify-between items-center w-42 p-3'}>
                <Text className={'text-4xl font-bold'}>Reps:</Text>
                <Text className={'text-4xl font-bold'}>{props.reps[set-1]}</Text>
            </View>
        </View>
    );
}

type counterPropsType = {
    sets: number,
    reps: number[]
}