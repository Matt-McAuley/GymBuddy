import {View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput} from "react-native";
import {Dropdown} from "react-native-element-dropdown";
import {useProgramStore, useStore} from "@/store";
import {useState} from "react";
import {createNewProgram, getDayNames} from "@/db/programDBFunctions";

export default function AddProgram() {
    const {setProgramForm} = useProgramStore();
    const {db} = useStore();
    const [programData, setProgramData] = useState<programDataType>({
        name: '', Sunday: '', Monday: '', Tuesday: '', Wednesday: '', Thursday: '', Friday: '', Saturday: ''});
    const dayNames = getDayNames(db);

    return (
        <ScrollView className={'p-4'}>
            <TouchableOpacity className={'h-15 bg-red-500 mb-4 p-3 w-20 self-end'}
            onPress={() => {setProgramForm(false)}}>
                <Text className={'text-center text-4xl color-white font-bold'}>X</Text>
            </TouchableOpacity>
            <TextInput
                className={'h-28 w-full text-center border-4 rounded-xl text-4xl font-bold mb-3 bg-white'}
                onChangeText={(text) => setProgramData({...programData, name: text})}
                placeholder={'Enter Name'}
                placeholderTextColor={'black'}>
            </TextInput>

            {
                ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map((day) => {
                return <Dropdown key={day} style={styles.dropdown} selectedTextStyle={styles.selected} placeholderStyle={styles.placeholder}
                          label={day}
                          data={dayNames.map((day) => ({label: day, value: day}))}
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
                                  createNewProgram(db, programData.name, programData.Sunday, programData.Monday,
                                      programData.Tuesday, programData.Wednesday, programData.Thursday,
                                      programData.Friday, programData.Saturday);
                                  setProgramForm(false);
                              }}>
                <Text className={'text-center text-4xl color-white font-bold'}>Submit</Text>
            </TouchableOpacity>
        </ScrollView>
    );
}

type programDataType = {
    name: string,
    Sunday: string,
    Monday: string,
    Tuesday: string,
    Wednesday: string,
    Thursday: string,
    Friday: string,
    Saturday: string,
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
        color: 'black',
        textAlign: 'center',
        fontSize: 30,
        fontWeight: 'bold',
    }
});
