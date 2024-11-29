import {Text, ScrollView, TouchableOpacity, View} from "react-native";
import {useStore} from "@/store";
import {getProgramNames} from "@/db/programDBFunctions";
import ProgramDisplayCard from "@/components/Programs/ProgramDisplayCard";
import {Link} from 'expo-router';
import {useState} from "react";

export default function Programs() {
    const {db} = useStore();
    const [form, setForm] = useState(false);
    const programNames = getProgramNames(db);

    return (
        (form) ? 
            <View>
                <Text>Hi</Text>
            </View>

            :
        <ScrollView className={'p-4'}>
            {programNames.map((programName) => <ProgramDisplayCard key={programName} programName={programName}/>)}
            <TouchableOpacity onPress={() => setForm(true)}
                className={'w-full h-25 border-4 border-dashed border-gray-500 rounded-2xl mb-5 flex-row justify-around items-center'}>
                <Text className={'text-4xl text-center font-bold color-gray-500'}>Add New Program</Text>
            </TouchableOpacity>
        </ScrollView>
    );
}