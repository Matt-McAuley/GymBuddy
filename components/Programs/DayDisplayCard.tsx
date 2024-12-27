import {Text, TouchableOpacity, Image, View, ScrollView} from "react-native";
import {useProgramStore} from "@/store";

export default function DayDisplayCard(props: DayDisplayCardPropsType) {
    const dayName = props.dayName;
    const {setEditDay} = useProgramStore();

    return (
        <View className={'w-full h-28 border-4 rounded-2xl mb-5 flex-row justify-between items-center'}>
            <ScrollView className={'flex-row w-80'} contentContainerStyle={{justifyContent: 'center', alignItems: 'center', flexGrow: 1}} horizontal>
                <Text className={`text-center text-4xl p-5 font-bold`} style={{color: props.dayColor}}>{dayName}</Text>
            </ScrollView>
            <View className={'flex-row justify-center items-center'}>
                <TouchableOpacity onPress={() => {setEditDay(dayName)}}>
                    <Image className={'w-20 h-20 p-5'} source={require('@/assets/images/programs/edit.png')}/>
                </TouchableOpacity>
            </View>
        </View>
    );
}

type DayDisplayCardPropsType = {
    dayName: string,
    dayColor: string
}