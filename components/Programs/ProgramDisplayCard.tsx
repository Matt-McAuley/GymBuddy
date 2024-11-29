import {Text, TouchableOpacity, Image} from "react-native";
import * as SQLite from 'expo-sqlite';
import {useStore} from "@/store";
import {setCurrentProgram} from "@/db/programDBFunctions";
import {getProgram} from "@/db/dbFunctions";

export default function ProgramDisplayCard(props: ProgramDisplayCardPropsType) {
    const programName = props.programName;
    const db = SQLite.openDatabaseSync('programs.db');
    const {program, setProgram} = useStore();

    return (
        <TouchableOpacity onPress={() => {
            setCurrentProgram(db, programName);
            setProgram(getProgram(db));
        }}
                          className={'w-full h-25 border-4 rounded-2xl mb-5 flex-row justify-around items-center'}>
            <Text className={'text-center text-6xl p-5 font-bold'}>
                {programName}</Text>
            {(program?.name === programName) ?
                <Image className={'w-12 h-12 bg-green-500 rounded-2xl'} source={require('@/assets/images/programs/selected.png')}/>
                : null}
            <TouchableOpacity>
                <Image className={'w-20 h-20 p-5'} source={require('@/assets/images/programs/edit.png')}/>
            </TouchableOpacity>
        </TouchableOpacity>
    );
}

type ProgramDisplayCardPropsType = {
    programName: string;
}