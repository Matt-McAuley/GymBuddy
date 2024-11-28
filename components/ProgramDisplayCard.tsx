import {View, Text, ScrollView, TouchableOpacity, Image} from "react-native";
import {useEffect, useState} from "react";
import * as SQLite from 'expo-sqlite';
import { useDrizzleStudio } from "expo-drizzle-studio-plugin";
import {useStore} from "@/store";
import {getProgramNames} from "@/db/programDBFunctions";

export default function ProgramDisplayCard(props: ProgramDisplayCardPropsType) {
    const programName = props.programName;
    const {program} = useStore();

    return (
        <TouchableOpacity className={'w-full h-25 border-4 rounded-2xl mb-5 flex-row justify-around items-center'}>
            <Text className={'text-center text-6xl p-5 font-bold'}>
                {programName}</Text>
            {(program?.name === programName) ?
                <Image className={'w-12 h-12 bg-green-500 rounded-2xl'} source={require('@/assets/images/programs/selected.png')}/>
                : null}
            <TouchableOpacity>
                <Image className={'w-12 h-12'} source={require('@/assets/images/programs/edit.png')}/>
            </TouchableOpacity>
        </TouchableOpacity>
    );
}

type ProgramDisplayCardPropsType = {
    programName: string;
}