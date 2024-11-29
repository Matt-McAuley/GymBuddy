import {View, Text, ScrollView, TouchableOpacity} from "react-native";
import {useEffect, useState} from "react";
import {useStore} from "@/store";
import {getProgramNames} from "@/db/programDBFunctions";
import ProgramDisplayCard from "@/components/ProgramDisplayCard";

export default function Programs() {
    const {db} = useStore();
    const programNames = getProgramNames(db);

    return (
        <ScrollView className={'p-4'}>
            {programNames.map((programName) => <ProgramDisplayCard key={programName} programName={programName}/>)}
            <TouchableOpacity className={'w-full h-25 border-4 border-dashed border-gray-500 rounded-2xl mb-5 flex-row justify-around items-center'}>
                <Text className={'text-4xl text-center font-bold color-gray-500'}>Add new program</Text>
            </TouchableOpacity>
        </ScrollView>
    );
}