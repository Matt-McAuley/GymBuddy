import {View, Text, ScrollView} from "react-native";
import {useEffect, useState} from "react";
import * as SQLite from 'expo-sqlite';
import { useDrizzleStudio } from "expo-drizzle-studio-plugin";
import {useStore} from "@/store";
import {getProgramNames} from "@/db/programDBFunctions";
import ProgramDisplayCard from "@/components/ProgramDisplayCard";

export default function Programs() {
    const db = SQLite.openDatabaseSync('programs.db');
    useDrizzleStudio(db);
    const programNames = getProgramNames(db);

    return (
        <ScrollView className={'p-4'}>
            {programNames.map((programName) => <ProgramDisplayCard key={programName} programName={programName}/>)}
        </ScrollView>
    );
}