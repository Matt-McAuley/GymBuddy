import {Text, TouchableOpacity, Image, View, TouchableWithoutFeedback} from "react-native";
import * as SQLite from 'expo-sqlite';
import {useProgramStore, useStore} from "@/store";

export default function DayDisplayCard(props: DayDisplayCardPropsType) {
    const dayName = props.dayName;
    const db = SQLite.openDatabaseSync('programs.db');
    const {program, setProgram} = useStore();
    const {setEditDay} = useProgramStore();

    return (
        <View className={'w-full h-28 border-4 rounded-2xl mb-5 flex-row justify-between items-center'}>
            <Text className={'text-center w-66 text-4xl p-5 font-bold'}>{dayName}</Text>
            <View className={'flex-row justify-center items-center'}>
                <TouchableOpacity onPress={() => {setEditDay(dayName)}}>
                    <Image className={'w-20 h-20 p-5'} source={require('@/assets/images/programs/edit.png')}/>
                </TouchableOpacity>
            </View>
        </View>
    );
}

type DayDisplayCardPropsType = {
    dayName: string;
}