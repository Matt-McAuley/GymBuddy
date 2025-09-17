import {View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput} from "react-native";
import {useProgramStore, useStore} from "@/store";
import { useState } from "react";
import { createNewExercise } from "@/db/programDBFunctions";
import Toast from 'react-native-toast-message';
import { setType } from "@/types/programType";
import { MaterialIcons } from '@expo/vector-icons';
import Swipeable from 'react-native-gesture-handler/ReanimatedSwipeable';
import DraggableFlatList, { ScaleDecorator, RenderItemParams } from 'react-native-draggable-flatlist';
import Animated from "react-native-reanimated";

export default function AddExercise() {
    const {setAddExerciseForm} = useProgramStore();
    const {db} = useStore();
    const [exerciseData, setExerciseData] = useState<exerciseDataType>({name: null, sets: [{id: Date.now(), rest: '90', weight: '225', reps: '5'}]});

    const HeaderComponent = () => (
        <View className={'p-4'}>
            <TouchableOpacity className={'h-15 bg-red-500 mb-4 p-3 w-20 self-end'}
                              onPress={() => {setAddExerciseForm(false)}}>
                <Text className={'text-center text-4xl color-white font-bold'}>X</Text>
            </TouchableOpacity>
            <Text className="text-3xl font-bold text-start mb-2">Exercise Name</Text>
            <TextInput
                className={'h-28 w-full text-center border-4 rounded-xl text-3xl font-bold mb-2 bg-white'}
                onEndEditing={(e) => setExerciseData({...exerciseData, name: e.nativeEvent.text})}
                placeholder={'Enter Exercise Name'}
                defaultValue={exerciseData.name?.toString()}
                placeholderTextColor={'gray'}>
            </TextInput>
            <View className="h-20 w-full text-center flex-row justify-around items-center">
                <View className="w-[50px]"></View>
                <View className="flex-1 flex-row justify-around items-center">
                    <Text className="text-3xl font-bold text-center flex-1 border-r-2">Rest</Text>
                    <Text className="text-3xl font-bold text-center flex-1 border-r-2">Weight</Text>
                    <Text className="text-3xl font-bold text-center flex-1">Reps</Text>
                </View>
            </View>
        </View>
    );

    const FooterComponent = () => (
        <View className={'p-4'}>
            <TouchableOpacity onPress={() => setExerciseData({...exerciseData, sets: [...(exerciseData.sets || []), {id: Date.now(), rest: '90', weight: '225', reps: '5'}]})}
                className={'w-full h-25 border-4 border-dashed border-gray-500 rounded-2xl mb-5 flex-row justify-around items-center'}>
                <Text className={'text-4xl text-center font-bold color-gray-500'}>Add New Set</Text>
            </TouchableOpacity>
            <TouchableOpacity className={'h-15 bg-green-500 mb-4 p-3 w-full'}
                              onPress={() => {
                                    console.log(exerciseData);
                                    const exerciseDataSets : setType[] = [];
                                    if (exerciseData.sets != null) {
                                        for (let i = 0; i < exerciseData.sets.length; i++) {
                                            const set = exerciseData.sets[i];
                                            const rest = parseInt(set.rest);
                                            const weight = parseInt(set.weight);
                                            const reps = parseInt(set.reps);
                                            console.log(`Rest: ${rest}, Weight: ${weight}, Reps: ${reps}`);
                                            if (!isNaN(rest) && !isNaN(weight) && !isNaN(reps)) {
                                                exerciseDataSets.push({rest, weight, reps});
                                            }
                                            else {
                                                console.log('Invalid number in sets');
                                                Toast.show({
                                                    type: 'error',
                                                    text1: 'Error',
                                                    text2: 'Please enter valid numbers for each set.',
                                                });
                                                setAddExerciseForm(false);
                                                return;
                                            }
                                        }
                                    }
                                    const result = createNewExercise(db, exerciseData.name, exerciseDataSets);
                                    if (result == 'success') {
                                        Toast.show({
                                            type: 'success',
                                            text1: 'Success',
                                            text2: 'Exercise Created',
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
                                    setAddExerciseForm(false);
                              }}>
                <Text className={'text-center text-4xl color-white font-bold'}>Submit</Text>
            </TouchableOpacity>
        </View>
    );

    const renderItem = ({ item, drag, isActive, getIndex }: RenderItemParams<setDataType>) => {
        return (
            <ScaleDecorator>
                <Animated.View key={`set-${item.id}`} className="w-full mb-3 relative px-4">
                    <Swipeable overshootFriction={6} friction={1.5} renderRightActions={() => (
                        <View className="w-25 h-22 bg-red-500 justify-center items-center mr-1 rounded-xl">
                            <TouchableOpacity
                                className="w-full h-full justify-center items-center hover:opacity-70"
                                onPress={() => {
                                    const index = getIndex();
                                    if (index !== undefined) {
                                        const updatedSets = exerciseData.sets!.filter((_, i) => i !== index);
                                        setExerciseData({ ...exerciseData, sets: updatedSets });
                                    }
                                }}>
                                <MaterialIcons name="delete" size={40} color="white" />
                            </TouchableOpacity>
                        </View>
                    )}>
                        <View className="flex-row justify-around items-center w-full">
                            <TouchableOpacity 
                                onLongPress={drag} 
                                disabled={isActive}
                                className=""
                            >
                                <MaterialIcons name="drag-indicator" size={50} color="gray" />
                            </TouchableOpacity>
                            <View className="flex-row justify-around items-center flex-1 bg-gray-100 rounded-xl self-end">
                                <TextInput
                                    className={'h-22 w-[30%] text-center border-4 rounded-xl text-3xl font-bold bg-white'}
                                    onChangeText={(text) => {
                                        const index = getIndex();
                                        if (index !== undefined) {
                                            setExerciseData({
                                                ...exerciseData,
                                                sets: exerciseData.sets!.map((set, i) => i === index ? { ...set, rest: text } : set),
                                            });
                                        }
                                    }}
                                    value={item.rest}
                                    keyboardType="numeric"/>
                                <TextInput
                                    className={'h-22 w-[30%] text-center border-4 rounded-xl text-3xl font-bold bg-white'}
                                    onChangeText={(text) => {
                                        const index = getIndex();
                                        if (index !== undefined) {
                                            setExerciseData({
                                                ...exerciseData,
                                                sets: exerciseData.sets!.map((set, i) => i === index ? { ...set, weight: text } : set),
                                            });
                                        }
                                    }}
                                    value={item.weight}
                                    keyboardType="numeric"/>
                                <TextInput
                                    className={'h-22 w-[30%] text-center border-4 rounded-xl text-3xl font-bold bg-white'}
                                    onChangeText={(text) => {
                                        const index = getIndex();
                                        if (index !== undefined) {
                                            setExerciseData({
                                                ...exerciseData,
                                                sets: exerciseData.sets!.map((set, i) => i === index ? { ...set, reps: text } : set),
                                            });
                                        }
                                    }}
                                    value={item.reps}
                                    keyboardType="numeric"/>
                            </View>
                        </View>
                    </Swipeable>
                </Animated.View>
            </ScaleDecorator>
        );
    };

    return (
        <DraggableFlatList
            data={exerciseData.sets || []}
            onDragEnd={({ data }) => setExerciseData({ ...exerciseData, sets: data })}
            keyExtractor={(item) => `draggable-item-${item.id}`}
            renderItem={renderItem}
            ListHeaderComponent={HeaderComponent}
            ListFooterComponent={FooterComponent}
            contentContainerStyle={{ paddingHorizontal: 0 }}
        />
    );
};

type setDataType = {
    id: number,
    rest: string,
    weight: string,
    reps: string,
}

type exerciseDataType = {
    name: string | null,
    sets: setDataType[] | null,
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
