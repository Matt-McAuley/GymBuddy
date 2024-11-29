import {Text, ScrollView, TouchableOpacity, View} from "react-native";
import {useProgramStore, useStore} from "@/store";
import {getProgramNames} from "@/db/programDBFunctions";
import ProgramDisplayCard from "@/components/Programs/ProgramDisplayCard";
import AddProgram from "@/components/Programs/Forms/AddProgram";
import {useEffect} from "react";

export default function Programs() {
    const {db} = useStore();
    const {programForm, setProgramForm, dayForm, setDayForm, exerciseForm, setExerciseForm} = useProgramStore();
    const programNames = getProgramNames(db);

    useEffect(() => {
        setProgramForm(false);
        setDayForm(false);
        setExerciseForm(false);
    }, []);

    return (
        (programForm) ?
            <AddProgram/>
            :
        <ScrollView className={'p-4'}>
            {programNames.map((programName) => <ProgramDisplayCard key={programName} programName={programName}/>)}
            <TouchableOpacity onPress={() => setProgramForm(true)}
                className={'w-full h-25 border-4 border-dashed border-gray-500 rounded-2xl mb-5 flex-row justify-around items-center'}>
                <Text className={'text-4xl text-center font-bold color-gray-500'}>Add New Program</Text>
            </TouchableOpacity>
        </ScrollView>
    );
}