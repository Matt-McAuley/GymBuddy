import {View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput} from "react-native";
import {useProgramStore, useStore} from "@/store";
import {useState} from "react";
import {
    deleteExercise,
    getAccessoryExerciseByName,
    getPrimaryExerciseByName, replaceAccessoryExercise, replacePrimaryExercise,
} from "@/db/programDBFunctions";
import Toast from 'react-native-toast-message';
import {getProgram} from "@/db/dbFunctions";

export default function EditExercise() {
    const {setEditExercise, editExercise} = useProgramStore();
    const {db, setCurrentExercise, setCurrentDay, setProgram} = useStore();
    const [primaryExerciseData, setPrimaryExerciseData] = useState<primaryExerciseDataType | null>(getPrimaryExerciseByName(db, editExercise!));
    const [accessoryExerciseData, setAccessoryExerciseData] = useState<accessoryExerciseDataType | null>(getAccessoryExerciseByName(db, editExercise!));
    const [isPrimary, _] = useState<boolean>(primaryExerciseData != null);
    const originalName = (isPrimary) ? getPrimaryExerciseByName(db, editExercise!)!.name : getAccessoryExerciseByName(db, editExercise!)!.name;

    return (
        <ScrollView className={'p-4'}>
            <TouchableOpacity className={'h-15 bg-red-500 mb-4 p-3 w-20 self-end'}
                              onPress={() => {setEditExercise(null)}}>
                <Text className={'text-center text-4xl color-white font-bold'}>X</Text>
            </TouchableOpacity>
            {(isPrimary) ?
                <>
                    <TextInput
                        className={'h-28 w-full text-center border-4 rounded-xl text-4xl font-bold mb-3 bg-white'}
                        onChangeText={(text) => setPrimaryExerciseData({...primaryExerciseData!, name: text})}
                        placeholder={'Name'}
                        placeholderTextColor={'gray'}>
                        {primaryExerciseData!.name}
                    </TextInput>
                    <TextInput
                        className={'h-28 w-full text-center border-4 rounded-xl text-4xl font-bold mb-3 bg-white'}
                        onChangeText={(text) => setPrimaryExerciseData({...primaryExerciseData!, rest: text})}
                        placeholder={'Rest (s)'}
                        keyboardType={'numeric'}
                        placeholderTextColor={'gray'}>
                        {primaryExerciseData!.rest}
                    </TextInput>
                    <Text className={'text-5xl font-bold text-center m-4'}>Weight:</Text>
                    <View className={'flex-row gap-4'}>
                        <TextInput
                            className={'h-28 w-32 text-center border-4 rounded-xl text-4xl font-bold mb-3 bg-white'}
                            onChangeText={(text) => setPrimaryExerciseData({...primaryExerciseData!, weight_1: text})}
                            placeholder={'Set 1'}
                            keyboardType={'numeric'}
                            placeholderTextColor={'gray'}>
                            {primaryExerciseData!.weight_1}
                        </TextInput>
                        <TextInput
                            className={'h-28 w-32 text-center border-4 rounded-xl text-4xl font-bold mb-3 bg-white'}
                            onChangeText={(text) => setPrimaryExerciseData({...primaryExerciseData!, weight_2: text})}
                            placeholder={'Set 2'}
                            keyboardType={'numeric'}
                            placeholderTextColor={'gray'}>
                            {primaryExerciseData!.weight_2}
                        </TextInput>
                        <TextInput
                            className={'h-28 w-32 text-center border-4 rounded-xl text-4xl font-bold mb-3 bg-white'}
                            onChangeText={(text) => setPrimaryExerciseData({...primaryExerciseData!, weight_3: text})}
                            placeholder={'Set 3'}
                            keyboardType={'numeric'}
                            placeholderTextColor={'gray'}>
                            {primaryExerciseData!.weight_3}
                        </TextInput>
                    </View>
                    <Text className={'text-5xl font-bold text-center m-4'}>Reps:</Text>
                    <View className={'flex-row gap-4'}>
                        <TextInput
                            className={'h-28 w-32 text-center border-4 rounded-xl text-4xl font-bold mb-3 bg-white'}
                            onChangeText={(text) => setPrimaryExerciseData({...primaryExerciseData!, reps_1: text})}
                            placeholder={'Set 1'}
                            keyboardType={'numeric'}
                            placeholderTextColor={'gray'}>
                            {primaryExerciseData!.reps_1}
                        </TextInput>
                        <TextInput
                            className={'h-28 w-32 text-center border-4 rounded-xl text-4xl font-bold mb-3 bg-white'}
                            onChangeText={(text) => setPrimaryExerciseData({...primaryExerciseData!, reps_2: text})}
                            placeholder={'Set 2'}
                            keyboardType={'numeric'}
                            placeholderTextColor={'gray'}>
                            {primaryExerciseData!.reps_2}
                        </TextInput>
                        <TextInput
                            className={'h-28 w-32 text-center border-4 rounded-xl text-4xl font-bold mb-3 bg-white'}
                            onChangeText={(text) => setPrimaryExerciseData({...primaryExerciseData!, reps_3: text})}
                            placeholder={'Set 3'}
                            keyboardType={'numeric'}
                            placeholderTextColor={'gray'}>
                            {primaryExerciseData!.reps_3}
                        </TextInput>
                    </View>
                </>
                :
                <>
                    <TextInput
                        className={'h-28 w-full text-center border-4 rounded-xl text-4xl font-bold mb-3 bg-white'}
                        onChangeText={(text) => setAccessoryExerciseData({...accessoryExerciseData!, name: text})}
                        placeholder={'Name'}
                        placeholderTextColor={'gray'}>
                        {accessoryExerciseData!.name}
                    </TextInput>
                    <View className={'flex-row gap-4'}>
                        <TextInput
                            className={'h-28 w-50 text-center border-4 rounded-xl text-4xl font-bold mb-3 bg-white'}
                            onChangeText={(text) => setAccessoryExerciseData({...accessoryExerciseData!, rest: text})}
                            placeholder={'Rest'}
                            keyboardType={'numeric'}
                            placeholderTextColor={'gray'}>
                            {accessoryExerciseData!.rest}
                        </TextInput>
                        <TextInput
                            className={'h-28 w-50 text-center border-4 rounded-xl text-4xl font-bold mb-3 bg-white'}
                            onChangeText={(text) => setAccessoryExerciseData({...accessoryExerciseData!, sets: text})}
                            placeholder={'Sets'}
                            keyboardType={'numeric'}
                            placeholderTextColor={'gray'}>
                            {accessoryExerciseData!.sets}
                        </TextInput>
                    </View>
                    <View className={'flex-row gap-4'}>
                        <TextInput
                            className={'h-28 w-50 text-center border-4 rounded-xl text-4xl font-bold mb-3 bg-white'}
                            onChangeText={(text) => setAccessoryExerciseData({...accessoryExerciseData!, weight: text})}
                            placeholder={'Weight'}
                            keyboardType={'numeric'}
                            placeholderTextColor={'gray'}>
                            {accessoryExerciseData!.weight}
                        </TextInput>
                        <TextInput
                            className={'h-28 w-50 text-center border-4 rounded-xl text-4xl font-bold mb-3 bg-white'}
                            onChangeText={(text) => setAccessoryExerciseData({...accessoryExerciseData!, reps: text})}
                            placeholder={'Reps'}
                            keyboardType={'numeric'}
                            placeholderTextColor={'gray'}>
                            {accessoryExerciseData!.reps}
                        </TextInput>
                    </View>
                </>
            }
            <TouchableOpacity className={'h-15 bg-green-500 mb-4 p-3 w-full'}
                              onPress={() => {
                                  if (isPrimary) {
                                      const result = replacePrimaryExercise(db, originalName!,
                                          primaryExerciseData!.name, primaryExerciseData!.rest,
                                          primaryExerciseData!.weight_1, primaryExerciseData!.reps_1,
                                          primaryExerciseData!.weight_2, primaryExerciseData!.reps_2,
                                          primaryExerciseData!.weight_3, primaryExerciseData!.reps_3);
                                      if (result == 'success') {
                                          Toast.show({
                                              type: 'success',
                                              text1: 'Success',
                                              text2: 'Primary Exercise Edited',
                                              text1Style: {fontSize: 30},
                                              text2Style: {fontSize: 30},
                                          });
                                          setCurrentDay(0);
                                          setCurrentExercise(0);
                                          setProgram(getProgram(db));
                                      }
                                      else {
                                          Toast.show({
                                              type: 'error',
                                              text1: 'Error',
                                              text2: result,
                                          });
                                      }
                                  }
                                  else {
                                      const result = replaceAccessoryExercise(db, originalName!, accessoryExerciseData!.name,
                                          accessoryExerciseData!.rest, accessoryExerciseData!.sets,
                                          accessoryExerciseData!.weight, accessoryExerciseData!.reps);
                                      if (result == 'success') {
                                          Toast.show({
                                              type: 'success',
                                              text1: 'Success',
                                              text2: 'Accessory Exercise Edited',
                                              text1Style: {fontSize: 30},
                                              text2Style: {fontSize: 30},
                                          });
                                          setCurrentDay(0);
                                          setCurrentExercise(0);
                                          setProgram(getProgram(db));
                                      }
                                      else {
                                          Toast.show({
                                              type: 'error',
                                              text1: 'Error',
                                              text2: result,
                                          });
                                      }
                                  }
                                  setEditExercise(null);
                              }}>
                <Text className={'text-center text-4xl color-white font-bold'}>Submit</Text>
            </TouchableOpacity>
            <TouchableOpacity className={'h-15 bg-red-500 mb-4 p-3 w-full'}
                              onPress={() => {
                                  deleteExercise(db, (isPrimary) ? primaryExerciseData!.name! : accessoryExerciseData!.name!);
                                  Toast.show({
                                      type: "success",
                                      text1: "Success",
                                      text2: "Exercise Deleted",
                                  });
                                  setCurrentDay(0);
                                  setCurrentExercise(0);
                                  setProgram(getProgram(db));
                                  setEditExercise(null);
                              }}>
                <Text className={'text-center text-4xl color-white font-bold'}>Delete</Text>
            </TouchableOpacity>
        </ScrollView>
    );
}

type primaryExerciseDataType = {
    name: string | null,
    rest: string | null,
    weight_1: string | null,
    reps_1: string | null,
    weight_2: string | null,
    reps_2: string | null,
    weight_3: string | null,
    reps_3: string | null,
}

type accessoryExerciseDataType = {
    name: string | null,
    rest: string | null,
    sets: string | null,
    weight: string | null,
    reps: string | null,
}

const styles = StyleSheet.create({
    ss1DropdownLeft: {
        width: '100%',
        height: 90,
        borderBottomWidth: 3,
    },
    ss2dropdownLeft: {
        width: '100%',
        height: 90,
    },
    ssDropdownRight: {
        width: '20%',
        height: 180,
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 10,
        borderColor: 'black',
        borderWidth: 3,
        marginBottom: 10,
        marginLeft: 10,
    },
    dropdownLeft: {
        width: '77%',
        height: 90,
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 10,
        borderColor: 'black',
        borderWidth: 3,
        marginBottom: 10,
    },
    dropdownRight: {
        width: '20%',
        height: 90,
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 10,
        borderColor: 'black',
        borderWidth: 3,
        marginBottom: 10,
        marginLeft: 10,
    },
    dropdown: {
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
    },
    orderPlaceholder: {
        color: 'black',
        textAlign: 'center',
        fontSize: 30,
        fontWeight: 'bold',
    }
});
