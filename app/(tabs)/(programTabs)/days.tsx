import {Text, ScrollView, TouchableOpacity} from "react-native";
import {useProgramStore, useStore} from "@/store";
import {getDayNamesColors} from "@/db/programDBFunctions";
import DayDisplayCard from "@/components/Programs/DayDisplayCard";
import {useEffect} from "react";
import AddDay from "@/components/Programs/Forms/AddDay";
import EditDay from "@/components/Programs/Forms/EditDay";

export default function Days() {
    const {db} = useStore();
    const {addDayForm, editDay, setAddProgramForm, setAddExerciseForm, setAddDayForm, setEditProgram, setEditExercise, setEditDay} = useProgramStore();
    const dayNames = getDayNamesColors(db);

    useEffect(() => {
        setAddProgramForm(false);
        setEditProgram(null);
        setAddExerciseForm(false);
        setEditExercise(null);
        setAddDayForm(false);
        setEditDay(null);
    }, []);

    return (
        (addDayForm) ?
            <AddDay/>
            :
            (editDay != null) ?
                <EditDay />
                :
                <ScrollView className={'p-4'}>
                    {dayNames.map((day) => <DayDisplayCard key={day.name} dayName={day.name} dayColor={day.color}/>)}
                    <TouchableOpacity onPress={() => setAddDayForm(true)}
                                      className={'w-full h-25 border-4 border-dashed border-gray-500 rounded-2xl mb-5 flex-row justify-around items-center'}>
                        <Text className={'text-4xl text-center font-bold color-gray-500'}>Add New Day</Text>
                    </TouchableOpacity>
                </ScrollView>
    );
}