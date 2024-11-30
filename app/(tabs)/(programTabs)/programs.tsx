import {Text, ScrollView, TouchableOpacity, View} from "react-native";
import {useProgramStore, useStore} from "@/store";
import {getProgramNames} from "@/db/programDBFunctions";
import ProgramDisplayCard from "@/components/Programs/ProgramDisplayCard";
import AddProgram from "@/components/Programs/Forms/AddProgram";
import {useEffect} from "react";
import EditProgram from "@/components/Programs/Forms/EditProgram";

export default function Programs() {
    const {db} = useStore();
    const {addProgramForm, editProgram, setAddProgramForm} = useProgramStore();
    const programNames = getProgramNames(db);

    return (
        (addProgramForm) ?
            <AddProgram/>
            :
            (editProgram != null) ?
                <EditProgram />
                :
        <ScrollView className={'p-4'}>
            {programNames.map((programName) =>
                <View key={programName}>
                    <ProgramDisplayCard programName={programName}/>
                </View>
            )}
            <TouchableOpacity onPress={() => setAddProgramForm(true)}
                className={'w-full h-25 border-4 border-dashed border-gray-500 rounded-2xl mb-5 flex-row justify-around items-center'}>
                <Text className={'text-4xl text-center font-bold color-gray-500'}>Add New Program</Text>
            </TouchableOpacity>
        </ScrollView>
    );
}