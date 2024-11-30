import {View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput} from "react-native";
import {Dropdown} from "react-native-element-dropdown";
import {useProgramStore, useStore} from "@/store";
import {useState} from "react";
import {
    createNewAccessoryExercise,
    createNewDay,
    createNewPrimaryExercise,
    createNewProgram,
    getAccessoryExercises,
    getPrimaryExercises
} from "@/db/programDBFunctions";
import Toast from 'react-native-toast-message';

export default function AddExercise() {
    const {setAddExerciseForm} = useProgramStore();
    const {db} = useStore();
    const [isPrimary, setIsPrimary] = useState<boolean>(true);
    const [primaryExerciseData, setPrimaryExerciseData] = useState<primaryExerciseDataType>({
        name: null, rest: null, sets: null, weight_1: null, reps_1: null, weight_2: null, reps_2: null, weight_3: null, reps_3: null});
    const [accessoryExerciseData, setAccessoryExerciseData] = useState<accessoryExerciseDataType>({
        name: null, rest: null, sets: null, weight: null, reps: null});

    return (
        <ScrollView className={'p-4'}>
            <TouchableOpacity className={'h-15 bg-red-500 mb-4 p-3 w-20 self-end'}
                              onPress={() => {setAddExerciseForm(false)}}>
                <Text className={'text-center text-4xl color-white font-bold'}>X</Text>
            </TouchableOpacity>
            <View className={'flex-row gap-2 mb-5'}>
                <TouchableOpacity className={'border-black border-2 p-3 rounded-2xl'}
                                  onPress={() => {setIsPrimary(true)}}
                                  style={{backgroundColor: (isPrimary) ? 'lightblue': 'white'}}>
                    <Text className={'text-xl font-bold text-center'}>Primary Exercise</Text>
                </TouchableOpacity>
                <TouchableOpacity className={'border-black border-2 p-3 flex-1 rounded-2xl'}
                                  onPress={() => {setIsPrimary(false)}}
                                  style={{backgroundColor: (!isPrimary) ? 'lightblue': 'white'}}>
                <Text className={'text-xl font-bold text-center'}>Accessory Exercise</Text>
                </TouchableOpacity>
            </View>
            {(isPrimary) ?
                <>
                    <TextInput
                        className={'h-28 w-full text-center border-4 rounded-xl text-4xl font-bold mb-3 bg-white'}
                        onChangeText={(text) => setPrimaryExerciseData({...primaryExerciseData, name: text})}
                        placeholder={'Name'}
                        placeholderTextColor={'gray'}>
                    </TextInput>
                    <View className={'flex-row gap-4'}>
                        <TextInput
                            className={'h-28 w-50 text-center border-4 rounded-xl text-4xl font-bold mb-3 bg-white'}
                            onChangeText={(text) => setPrimaryExerciseData({...primaryExerciseData, rest: parseInt(text)})}
                            placeholder={'Rest'}
                            keyboardType={'numeric'}
                            placeholderTextColor={'gray'}>
                        </TextInput>
                        <TextInput
                            className={'h-28 w-50 text-center border-4 rounded-xl text-4xl font-bold mb-3 bg-white'}
                            onChangeText={(text) => setPrimaryExerciseData({...primaryExerciseData, sets: parseInt(text)})}
                            placeholder={'Sets'}
                            keyboardType={'numeric'}
                            placeholderTextColor={'gray'}>
                        </TextInput>
                    </View>
                    <Text className={'text-5xl font-bold text-center m-4'}>Weight:</Text>
                    <View className={'flex-row gap-4'}>
                        <TextInput
                            className={'h-28 w-32 text-center border-4 rounded-xl text-4xl font-bold mb-3 bg-white'}
                            onChangeText={(text) => setPrimaryExerciseData({...primaryExerciseData, weight_1: parseInt(text)})}
                            placeholder={'Set 1'}
                            keyboardType={'numeric'}
                            placeholderTextColor={'gray'}>
                        </TextInput>
                        <TextInput
                            className={'h-28 w-32 text-center border-4 rounded-xl text-4xl font-bold mb-3 bg-white'}
                            onChangeText={(text) => setPrimaryExerciseData({...primaryExerciseData, weight_2: parseInt(text)})}
                            placeholder={'Set 2'}
                            keyboardType={'numeric'}
                            placeholderTextColor={'gray'}>
                        </TextInput>
                        <TextInput
                            className={'h-28 w-32 text-center border-4 rounded-xl text-4xl font-bold mb-3 bg-white'}
                            onChangeText={(text) => setPrimaryExerciseData({...primaryExerciseData, weight_3: parseInt(text)})}
                            placeholder={'Set 3'}
                            keyboardType={'numeric'}
                            placeholderTextColor={'gray'}>
                        </TextInput>
                    </View>
                    <Text className={'text-5xl font-bold text-center m-4'}>Reps:</Text>
                    <View className={'flex-row gap-4'}>
                        <TextInput
                            className={'h-28 w-32 text-center border-4 rounded-xl text-4xl font-bold mb-3 bg-white'}
                            onChangeText={(text) => setPrimaryExerciseData({...primaryExerciseData, reps_1: parseInt(text)})}
                            placeholder={'Set 1'}
                            keyboardType={'numeric'}
                            placeholderTextColor={'gray'}>
                        </TextInput>
                        <TextInput
                            className={'h-28 w-32 text-center border-4 rounded-xl text-4xl font-bold mb-3 bg-white'}
                            onChangeText={(text) => setPrimaryExerciseData({...primaryExerciseData, reps_2: parseInt(text)})}
                            placeholder={'Set 2'}
                            keyboardType={'numeric'}
                            placeholderTextColor={'gray'}>
                        </TextInput>
                        <TextInput
                            className={'h-28 w-32 text-center border-4 rounded-xl text-4xl font-bold mb-3 bg-white'}
                            onChangeText={(text) => setPrimaryExerciseData({...primaryExerciseData, reps_3: parseInt(text)})}
                            placeholder={'Set 3'}
                            keyboardType={'numeric'}
                            placeholderTextColor={'gray'}>
                        </TextInput>
                    </View>
                </>
                :
                <>
                    <TextInput
                        className={'h-28 w-full text-center border-4 rounded-xl text-4xl font-bold mb-3 bg-white'}
                        onChangeText={(text) => setAccessoryExerciseData({...accessoryExerciseData, name: text})}
                        placeholder={'Name'}
                        placeholderTextColor={'gray'}>
                    </TextInput>
                    <View className={'flex-row gap-4'}>
                        <TextInput
                            className={'h-28 w-50 text-center border-4 rounded-xl text-4xl font-bold mb-3 bg-white'}
                            onChangeText={(text) => setAccessoryExerciseData({...accessoryExerciseData, rest: parseInt(text)})}
                            placeholder={'Rest'}
                            keyboardType={'numeric'}
                            placeholderTextColor={'gray'}>
                        </TextInput>
                        <TextInput
                            className={'h-28 w-50 text-center border-4 rounded-xl text-4xl font-bold mb-3 bg-white'}
                            onChangeText={(text) => setAccessoryExerciseData({...accessoryExerciseData, sets: parseInt(text)})}
                            placeholder={'Sets'}
                            keyboardType={'numeric'}
                            placeholderTextColor={'gray'}>
                        </TextInput>
                    </View>
                    <View className={'flex-row gap-4'}>
                        <TextInput
                            className={'h-28 w-50 text-center border-4 rounded-xl text-4xl font-bold mb-3 bg-white'}
                            onChangeText={(text) => setAccessoryExerciseData({...accessoryExerciseData, weight: parseInt(text)})}
                            placeholder={'Weight'}
                            keyboardType={'numeric'}
                            placeholderTextColor={'gray'}>
                        </TextInput>
                        <TextInput
                            className={'h-28 w-50 text-center border-4 rounded-xl text-4xl font-bold mb-3 bg-white'}
                            onChangeText={(text) => setAccessoryExerciseData({...accessoryExerciseData, reps: parseInt(text)})}
                            placeholder={'Reps'}
                            keyboardType={'numeric'}
                            placeholderTextColor={'gray'}>
                        </TextInput>
                    </View>
                </>
            }
            <TouchableOpacity className={'h-15 bg-green-500 mb-4 p-3 w-full'}
                              onPress={() => {
                                    if (isPrimary) {
                                        const result = createNewPrimaryExercise(db,
                                                primaryExerciseData.name, primaryExerciseData.rest, primaryExerciseData.sets,
                                                primaryExerciseData.weight_1, primaryExerciseData.reps_1,
                                                primaryExerciseData.weight_2, primaryExerciseData.reps_2,
                                                primaryExerciseData.weight_3, primaryExerciseData.reps_3);
                                        if (result == 'success') {
                                            Toast.show({
                                                type: 'success',
                                                text1: 'Success',
                                                text2: 'Primary Exercise Created',
                                                text1Style: {fontSize: 30},
                                                text2Style: {fontSize: 30},
                                            });
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
                                        const result = createNewAccessoryExercise(db, accessoryExerciseData.name,
                                            accessoryExerciseData.rest, accessoryExerciseData.sets,
                                            accessoryExerciseData.weight, accessoryExerciseData.reps);
                                        if (result == 'success') {
                                            Toast.show({
                                                type: 'success',
                                                text1: 'Success',
                                                text2: 'Accessory Exercise Created',
                                                text1Style: {fontSize: 30},
                                                text2Style: {fontSize: 30},
                                            });
                                        }
                                        else {
                                            Toast.show({
                                                type: 'error',
                                                text1: 'Error',
                                                text2: result,
                                            });
                                        }
                                    }
                                    setAddExerciseForm(false);
                              }}>
                <Text className={'text-center text-4xl color-white font-bold'}>Submit</Text>
            </TouchableOpacity>
        </ScrollView>
    );
}

type primaryExerciseDataType = {
    name: string | null,
    rest:number | null,
    sets: number | null,
    weight_1: number | null,
    reps_1: number | null,
    weight_2: number | null,
    reps_2: number | null,
    weight_3: number | null,
    reps_3: number | null,
}

type accessoryExerciseDataType = {
    name: string | null,
    rest: number | null,
    sets: number | null,
    weight: number | null,
    reps: number | null,
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
