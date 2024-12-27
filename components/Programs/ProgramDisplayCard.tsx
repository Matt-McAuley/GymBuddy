import {Text, TouchableOpacity, Image, View, ScrollView} from "react-native";
import * as SQLite from 'expo-sqlite';
import {useProgramStore, useStore} from "@/store";
import {setCurrentProgram} from "@/db/programDBFunctions";
import {getProgram} from "@/db/dbFunctions";

export default function ProgramDisplayCard(props: ProgramDisplayCardPropsType) {
    const programName = props.programName;
    const db = SQLite.openDatabaseSync('programs.db');
    const {program, setProgram, setCurrentDay, setCurrentExercise, setCurrentScheme} = useStore();
    const {setEditProgram} = useProgramStore();

    return (
        <View className={'w-full h-28 border-4 rounded-2xl mb-5 flex-row justify-between items-center'}>
            <ScrollView contentContainerStyle={{justifyContent: 'center', alignItems: 'center', flexGrow: 1}} horizontal>
                <Text className={'text-center text-4xl p-5 font-bold'}>{programName}</Text>
            </ScrollView>
            <View className={'flex-row justify-center items-center'}>
                {(program?.name === programName) ?
                    <Image className={'w-15 h-15 bg-green-500 rounded-2xl'} style={{tintColor: 'black', marginLeft: 20}} source={require('@/assets/images/programs/selected.png')}/>
                    :
                    <TouchableOpacity onPress={() => {
                        setCurrentDay(0);
                        setCurrentScheme('5 x 5');
                        setCurrentProgram(db, programName);
                        setProgram(getProgram(db))}}>
                        <Image className={'w-15 h-15 rounded-2xl'} style={{borderColor: 'gray', borderWidth: 2, tintColor: 'gray', marginLeft: 20}} source={require('@/assets/images/programs/selected.png')}/>
                    </TouchableOpacity>
                }
                        <TouchableOpacity onPress={() => {setEditProgram(programName)}}>
                    <Image className={'w-20 h-20 p-5'} source={require('@/assets/images/programs/edit.png')}/>
                </TouchableOpacity>
            </View>
        </View>
    );
}

type ProgramDisplayCardPropsType = {
    programName: string;
}