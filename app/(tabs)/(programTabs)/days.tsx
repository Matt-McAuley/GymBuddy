import {Text, ScrollView, TouchableOpacity, View} from "react-native";
import {useProgramStore, useStore} from "@/store";
import {getDayNamesColors, getExercisesAndSets} from "@/db/programDBFunctions";
import DayDisplayCard from "@/components/Programs/DayDisplayCard";
import AddDay from "@/components/Programs/Forms/AddDay";
import EditDay from "@/components/Programs/Forms/EditDay";
import Toast from 'react-native-toast-message';

export default function Days() {
    const {db} = useStore();
    const {addDayForm, editDay, setAddDayForm} = useProgramStore();
    const days = getDayNamesColors(db);
    const exercises = getExercisesAndSets(db).map(e => e.name);

    return (
        (addDayForm) ?
            <AddDay/>
            :
            (editDay != null) ?
                <EditDay />
                :
                <ScrollView className={'p-4'}>
                    <TouchableOpacity onPress={() => {
                        if (exercises.length === 0) {
                            Toast.show({
                                type: 'error',
                                text1: 'Error',
                                text2: 'You must add exercises before you can create a day!',
                            });
                            return;
                        }
                        setAddDayForm(true);
                    }}
                                      className={'w-full h-25 border-4 border-dashed border-gray-500 rounded-2xl mb-5 flex-row justify-around items-center'}>
                        <Text className={'text-4xl text-center font-bold color-gray-500'}>Add New Day</Text>
                    </TouchableOpacity>
                    {days.map((day) =>
                        <View key={day.name}>
                            <DayDisplayCard dayName={day.name} dayColor={day.color}/>
                        </View>
                    )}
                </ScrollView>
    );
}