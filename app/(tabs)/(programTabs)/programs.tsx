import {Text, FlatList, TouchableOpacity, View} from "react-native";
import {useProgramStore, useStore} from "@/store";
import {getProgramNames} from "@/db/programDBFunctions";
import ProgramDisplayCard from "@/components/Programs/ProgramDisplayCard";
import AddProgram from "@/components/Programs/Forms/AddProgram";
import EditProgram from "@/components/Programs/Forms/EditProgram";

export default function Programs() {
    const {db} = useStore();
    const {addProgramForm, editProgram, setAddProgramForm} = useProgramStore();
    const programNames = getProgramNames(db);

    const renderProgram = ({ item }: { item: string }) => (
        <ProgramDisplayCard programName={item}/>
    );

    return (
        (addProgramForm) ?
            <AddProgram/>
            :
            (editProgram != null) ?
                <EditProgram />
                :
                <View style={{ flex: 1, padding: 16 }}>
                    <TouchableOpacity onPress={() => setAddProgramForm(true)}
                                      className={'w-full h-25 border-4 border-dashed border-gray-500 rounded-2xl mb-5 flex-row justify-around items-center'}>
                        <Text className={'text-4xl text-center font-bold color-gray-500'}>Add New Program</Text>
                    </TouchableOpacity>
                    
                    <FlatList
                        data={programNames}
                        renderItem={renderProgram}
                        keyExtractor={(item) => item}
                        showsVerticalScrollIndicator={false}
                    />
                </View>
    );
}