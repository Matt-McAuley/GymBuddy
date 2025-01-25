import {View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput} from "react-native";
import {Dropdown} from "react-native-element-dropdown";
import {useProgramStore, useStore} from "@/store";
import {useState} from "react";
import {
    deleteProgram,
    getDayNames,
    getProgramByName,
    replaceProgram,
    setCurrentProgram,
    setNullIfCurrentProgram
} from "@/db/programDBFunctions";
import Toast from 'react-native-toast-message';
import {getProgram} from "@/db/dbFunctions";

export default function EditProgram() {
    const {setEditProgram, editProgram} = useProgramStore();
    const {db, setProgram, reset} = useStore();
    const [programData, setProgramData] = useState<programDataType>(getProgramByName(db, editProgram!));
    const originalName = getProgramByName(db, editProgram!).name;
    const dayNames = getDayNames(db);

    return (
        <ScrollView className={'p-4'}>
            <TouchableOpacity className={'h-15 bg-red-500 mb-4 p-3 w-20 self-end'}
                              onPress={() => {setEditProgram(null)}}>
                <Text className={'text-center text-4xl color-white font-bold'}>X</Text>
            </TouchableOpacity>
            <TextInput
                className={'h-28 w-full text-center border-4 rounded-xl text-4xl font-bold mb-3 bg-white'}
                onChangeText={(text) => setProgramData({...programData, name: text})}
                value={programData.name!}>
            </TextInput>
            {
                ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map((day) => {
                    return <Dropdown key={day} style={styles.dropdown} selectedTextStyle={styles.selected} placeholderStyle={styles.placeholder}
                                     label={(programData[day] == null) ? day : programData[day]}
                                     data={[{label: 'None', value: null}, ...dayNames.map((day) => ({label: day, value: day}))]}
                                     labelField='label' valueField='value' placeholder={`Enter ${day}`}
                                     value={programData[day]} renderRightIcon={() => null}
                                     renderItem={(item) => (
                                         <View style={styles.item}>
                                             <Text style={styles.itemText}>{item.label}</Text>
                                         </View>)}
                                     onChange={(item) => {setProgramData({...programData, [day]: item.value})}}/>
                })
            }
            <TouchableOpacity className={'h-15 bg-green-500 mb-4 p-3 w-full'}
                              onPress={() => {
                                  const currentProgram = getProgram(db);
                                  const result = replaceProgram(db, originalName, programData.name, programData.Sunday, programData.Monday,
                                      programData.Tuesday, programData.Wednesday, programData.Thursday,
                                      programData.Friday, programData.Saturday);
                                  if (result == 'success') {
                                      Toast.show({
                                          type: 'success',
                                          text1: 'Success',
                                          text2: 'Program Edited',
                                          text1Style: {fontSize: 30},
                                          text2Style: {fontSize: 30},
                                      });
                                      if (currentProgram?.name == originalName)
                                          setCurrentProgram(db, programData.name);
                                      reset();
                                      setProgram(getProgram(db));
                                  }
                                  else {
                                      Toast.show({
                                          type: 'error',
                                          text1: 'Error',
                                          text2: result,
                                      });
                                      setNullIfCurrentProgram(db, originalName);
                                      setProgram(getProgram(db));
                                  }
                                  setEditProgram(null);
                              }}>
                <Text className={'text-center text-4xl color-white font-bold'}>Submit</Text>
            </TouchableOpacity>
            <TouchableOpacity className={'h-15 bg-red-500 mb-4 p-3 w-full'}
                              onPress={() => {
                                  deleteProgram(db, originalName);
                                  Toast.show({
                                      type: "success",
                                      text1: "Success",
                                      text2: "Program Deleted",
                                  });
                                  setNullIfCurrentProgram(db, originalName);
                                  reset();
                                  setProgram(getProgram(db));
                                  setEditProgram(null);
                              }}>
                <Text className={'text-center text-4xl color-white font-bold'}>Delete</Text>
            </TouchableOpacity>
        </ScrollView>
    );
}

type programDataType = {
    name: string | null,
    Sunday: string | null,
    Monday: string | null,
    Tuesday: string | null,
    Wednesday: string | null,
    Thursday: string | null,
    Friday: string | null,
    Saturday: string | null,
}

const styles = StyleSheet.create({
    dropdown: {
        width: '100%',
        height: 90,
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 10,
        borderColor: 'black',
        borderWidth: 3,
        marginBottom: 10,
    },
    selected: {
        color: 'black',
        textAlign: 'center',
        fontSize: 30,
        fontWeight: 'bold',
    },
    item: {
        padding: 10,
        height: 50,
        borderBottomWidth: 1,
        borderBottomColor: 'gray',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    itemText: {
        fontSize: 25,
        color: 'black',
        fontWeight: 'bold',
    },
    placeholder: {
        color: 'gray',
        textAlign: 'center',
        fontSize: 30,
        fontWeight: 'bold',
    }
});

type arrayType = {
    label: string,
    value: string | null,
}