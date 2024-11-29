import {Text, ScrollView, TouchableOpacity} from "react-native";
import {useProgramStore, useStore} from "@/store";
import {getDayNames} from "@/db/programDBFunctions";
import DayDisplayCard from "@/components/Programs/DayDisplayCard";
import {useEffect} from "react";

export default function Days() {
    const {db} = useStore();
    const dayNames = getDayNames(db);
    const {setProgramForm, setDayForm, setExerciseForm} = useProgramStore();

    useEffect(() => {
        setProgramForm(false);
        setDayForm(false);
        setExerciseForm(false);
    }, []);

    return (
        <ScrollView className={'p-4'}>
            {dayNames.map((dayName) => <DayDisplayCard key={dayName} dayName={dayName}/>)}
            <TouchableOpacity className={'w-full h-25 border-4 border-dashed border-gray-500 rounded-2xl mb-5 flex-row justify-around items-center'}>
                <Text className={'text-4xl text-center font-bold color-gray-500'}>Add New Day</Text>
            </TouchableOpacity>
        </ScrollView>
    );
}