import {View, Text, StyleSheet, TouchableOpacity, TextInput} from "react-native";
import {useProgramStore, useStore} from "@/store";
import {useRef, useState} from "react";
import {getDayByName, getExerciseNames, getExercisesToNumSets, replaceDay} from "@/db/programDBFunctions";
import {getProgram} from "@/db/dbFunctions";
import Toast from 'react-native-toast-message';
import { MaterialIcons } from '@expo/vector-icons';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import DraggableFlatList, { ScaleDecorator, RenderItemParams } from 'react-native-draggable-flatlist';
import BottomSheet, { BottomSheetFlatList } from "@gorhom/bottom-sheet";

export default function EditDay() {
    const {editDay, setEditDay} = useProgramStore();
    const {db, reset, setProgram} = useStore();
    const exercisesToNumSets = getExercisesToNumSets(db);
    const exercises = getExerciseNames(db);
    const day = getDayByName(db, editDay!);
    let counter = 0;
    const [dayData, setDayData] = useState<dayDataType>({name: day.name, color: day.color, exercises: day.exercises.map((e) => {
        let exercise;
        if (e.superset_1) {
            exercise = {exercise1: {id: counter, name: e.superset_1, numSets: exercisesToNumSets.get(e.superset_1)}, 
            exercise2: {id: counter + 1, name: e.superset_2, numSets: exercisesToNumSets.get(e.superset_2)}};
            counter += 2;
        }
        else {
            exercise = {id: counter, name: e.exercise, numSets: exercisesToNumSets.get(e.exercise)};
            counter += 1;
        }
        return exercise;
    })});
    const [index, setIndex] = useState(0);
    const colorBottomSheetRef = useRef<BottomSheet>(null);
    const exerciseBottomSheetRef = useRef<BottomSheet>(null);
    const [sheetOpen, setSheetOpen] = useState(false);
    const [currentlyEditingIndex, setCurrentlyEditingIndex] = useState<number>(-1);
    
    const openSheet = (sheetRef: React.RefObject<BottomSheet>) => {
        sheetRef.current?.snapToIndex(0);
        setSheetOpen(true);
    }
    const closeSheet = (sheetRef: React.RefObject<BottomSheet>) => {
        sheetRef.current?.close();
        setSheetOpen(false);
    }

    const isSuperSet = (item: exerciseDataType | supersetDataType): item is supersetDataType => {
        return 'exercise1' in item;
    }

    const HeaderComponent = () => (
        <View className={'p-4'}>
            <TouchableOpacity className={'h-15 bg-red-500 mb-4 p-3 w-20 self-end'} onPress={() => {setEditDay(null)}}>
                <Text className={'text-center text-4xl color-white font-bold'}>X</Text>
            </TouchableOpacity>
            <Text className="text-3xl font-bold text-start mb-2">Day Name</Text>
            <TextInput
                className={'h-28 w-full text-center border-4 rounded-xl text-3xl font-bold mb-4 bg-white'}
                onEndEditing={(e) => setDayData({...dayData, name: e.nativeEvent.text})}
                placeholder={'Enter Day Name'}
                defaultValue={dayData.name}
                placeholderTextColor={'gray'}>
            </TextInput>
            <View className="h-22 flex-row justify-center items-center w-full mb-2 gap-6">
                <Text className="text-4xl font-bold">Day Color:</Text>
                <TouchableOpacity className={'border-4 rounded-xl font-bold justify-center items-center bg-white p-5'}
                    style={{width: '45%'}}
                    onPress={() => openSheet(colorBottomSheetRef)} >
                    <Text className="text-4xl text-center font-bold" style={{color: dayData.color.toLowerCase()}}>{dayData.color}</Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    const FooterComponent = () => (
        <View className={'p-4'}>
            <TouchableOpacity onPress={() => {
                setDayData({...dayData, exercises: [...(dayData.exercises), {id: index, name: ''}]});
                setIndex(index + 1);
            }}
                className={'w-full h-25 border-4 border-dashed border-gray-500 rounded-2xl mb-5 flex-row justify-around items-center'}>
                <Text className={'text-4xl text-center font-bold color-gray-500'}>Add New Exercise</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => {
                if (exercises.length == 1) {
                    Toast.show({
                        type: 'error',
                        text1: 'Error',
                        text2: 'You need at least 2 exercises to create a superset',
                    });
                    return;
                }
                setDayData({...dayData, exercises: [...(dayData.exercises), {exercise1: {id: index, name: ''}, exercise2: {id: index + 1, name: ''}}]});
                setIndex(index + 2);
            }}
                className={'w-full h-25 border-4 border-dashed border-gray-500 rounded-2xl mb-5 flex-row justify-around items-center'}>
                <Text className={'text-4xl text-center font-bold color-gray-500'}>Add New Superset</Text>
            </TouchableOpacity>
            <TouchableOpacity className={'h-15 bg-green-500 mb-4 p-3 w-full'}
                onPress={() => {
                    const exerciseNames = dayData.exercises.map((e) => {
                        if (isSuperSet(e)) {
                            return e.exercise1.name + ',' + e.exercise2.name;
                        }
                        return e.name;
                    });
                    const result = replaceDay(db, day.name, dayData.name.trim(), dayData.color.toLowerCase(), exerciseNames);
                    if (result == 'success') {
                        Toast.show({
                            type: 'success',
                            text1: 'Success',
                            text2: 'Day Edited',
                            text1Style: {fontSize: 30},
                            text2Style: {fontSize: 30},
                        });
                        setEditDay(null);
                        reset();
                        setProgram(getProgram(db));
                    }
                    else {
                        Toast.show({
                            type: 'error',
                            text1: 'Error',
                            text2: result,
                        });
                    }
                }}>
                <Text className={'text-center text-4xl color-white font-bold'}>Submit</Text>
            </TouchableOpacity>
        </View>
    );

    const renderItem = ({ item, drag, isActive, getIndex }: RenderItemParams<exerciseDataType | supersetDataType>) => {
        return (!isSuperSet(item)) ? (
            <ScaleDecorator>
                <View key={`set-${item.id}`} className="w-full mb-3 relative px-4">
                    <Swipeable overshootFriction={6} friction={1.5} renderRightActions={() => (
                        <View className="w-25 h-22 bg-red-500 justify-center items-center mr-1 rounded-2xl">
                            <TouchableOpacity
                                className="w-full h-full justify-center items-center hover:opacity-70"
                                onPress={() => {
                                    const index = getIndex() ?? -1;
                                    const updatedDay = dayData.exercises.filter((_, i) => i !== index);
                                    setDayData({ ...dayData, exercises: updatedDay });
                                }}>
                                <MaterialIcons name="delete" size={40} color="white" />
                            </TouchableOpacity>
                        </View>
                    )}>
                        <View className="flex-row justify-around items-center mb-1">
                            <TouchableOpacity onLongPress={drag} disabled={isActive} className="">
                                <MaterialIcons name="drag-indicator" size={50} color="gray" />
                            </TouchableOpacity>
                            <View className="flex-row justify-around items-center flex-1 bg-gray-100 rounded-2xl self-end">
                                <TouchableOpacity className={'border-4 rounded-2xl font-bold justify-center items-center bg-white p-5 h-22 w-[97%]'}
                                    onPress={() => {
                                        setCurrentlyEditingIndex(item.id);
                                        openSheet(exerciseBottomSheetRef);
                                    }}>
                                    <Text className="text-3xl text-center font-bold">{item.name}</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </Swipeable>
                </View>
            </ScaleDecorator>
        ) : 
        <ScaleDecorator>
            <View key={`set-${item.exercise1.id}`} className="w-full mb-3 relative px-4">
                <Swipeable overshootFriction={6} friction={1.5} renderRightActions={() => (
                    <View className="w-25 h-43 bg-red-500 justify-center items-center mr-1 rounded-2xl">
                        <TouchableOpacity
                            className="w-full h-full justify-center items-center hover:opacity-70"
                            onPress={() => {
                                const index = getIndex() ?? -1;
                                const updatedDay = dayData.exercises.filter((_, i) => i !== index);
                                setDayData({ ...dayData, exercises: updatedDay });
                            }}>
                            <MaterialIcons name="delete" size={40} color="white" />
                        </TouchableOpacity>
                    </View>
                )}>
                    <View className="flex-row justify-around items-center mb-1">
                        <TouchableOpacity onLongPress={drag} disabled={isActive} className="">
                            <MaterialIcons name="drag-indicator" size={50} color="gray" />
                        </TouchableOpacity>
                        <View className="flex-col justify-around items-center flex-1 bg-gray-100 rounded-2xl self-end">
                            <TouchableOpacity className={'border-4 -mb-1 rounded-t-2xl font-bold justify-center items-center bg-white p-5 h-22 w-[97%]'}
                                onPress={() => {
                                    setCurrentlyEditingIndex(item.exercise1.id);
                                    openSheet(exerciseBottomSheetRef);
                                }}>
                                <Text className="text-3xl text-center font-bold">{item.exercise1.name}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity className={'border-4 rounded-b-2xl font-bold justify-center items-center bg-white p-5 h-22 w-[97%]'}
                                onPress={() => {
                                    setCurrentlyEditingIndex(item.exercise2.id);
                                    openSheet(exerciseBottomSheetRef);
                                }}>
                                <Text className="text-3xl text-center font-bold">{item.exercise2.name}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Swipeable>
            </View>
        </ScaleDecorator>
    };

    return (
        <View>
            <DraggableFlatList
                data={dayData.exercises}
                onDragEnd={({ data }) => setDayData({ ...dayData, exercises: data })}
                keyExtractor={(item) => `draggable-item-${(!isSuperSet(item) ? item.id : item.exercise1.id)}`}
                renderItem={renderItem}
                ListHeaderComponent={HeaderComponent}
                ListFooterComponent={FooterComponent}
            />
            {(sheetOpen) && (
                <TouchableOpacity 
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: 'rgba(0,0,0,0.25)',
                    }}
                    activeOpacity={1}
                    onPress={() => {
                        closeSheet(colorBottomSheetRef);
                        closeSheet(exerciseBottomSheetRef);
                    }}
                />
            )}
            <BottomSheet ref={colorBottomSheetRef} index={-1} snapPoints={["50%"]} enableDynamicSizing={false} enableOverDrag={true}>
                <BottomSheetFlatList 
                    data={['Red', 'Orange', 'Yellow', 'Green', 'Blue', 'Purple', 'Pink', 'Brown']} 
                    renderItem={({item}) => (
                        <TouchableOpacity onPress={() => {
                            setDayData({...dayData, color: item});
                            closeSheet(colorBottomSheetRef);
                        }}>
                            <Text style={{...styles.itemText, color: item.toLowerCase(), padding: 20, textAlign: 'center'}}>{item}</Text>
                        </TouchableOpacity>
                    )} 
                    keyExtractor={(_, index) => index.toString()}
                />
            </BottomSheet>
            <BottomSheet ref={exerciseBottomSheetRef} index={-1} snapPoints={["50%"]} enableDynamicSizing={false} enableOverDrag={true}>
                <BottomSheetFlatList 
                    data={exercises} 
                    renderItem={({item}) => (
                        <TouchableOpacity onPress={() => {
                            setDayData({...dayData, exercises: [...dayData.exercises.map((ex) => 
                            {
                                if (!isSuperSet(ex)) {
                                    if (ex.id === currentlyEditingIndex) {
                                        return {id: ex.id, name: item};
                                    }
                                    return ex;
                                }
                                const itemNumSets = exercisesToNumSets.get(item);
                                if (ex.exercise1.id === currentlyEditingIndex) {
                                    if (ex.exercise2.name !== '') {
                                        if (ex.exercise2.name === item) {
                                            Toast.show({
                                                type: 'error',
                                                text1: 'Error',
                                                text2: 'Cannot have two of the same exercise in a superset',
                                            });
                                            return ex;
                                        }
                                        if (ex.exercise2.numSets !== undefined && ex.exercise2.numSets !== itemNumSets) {
                                            Toast.show({
                                                type: 'error',
                                                text1: 'Error',
                                                text2: 'Exercises in supersets must have the same number of sets',
                                            });
                                            return ex;
                                        }
                                    }
                                    return {exercise1: {id: ex.exercise1.id, name: item, numSets: itemNumSets}, exercise2: ex.exercise2};
                                }
                                if (ex.exercise2.id === currentlyEditingIndex) {
                                    if (ex.exercise1.name !== '') {
                                        if (ex.exercise1.name === item) {
                                            Toast.show({
                                                type: 'error',
                                                text1: 'Error',
                                                text2: 'Cannot have two of the same exercise',
                                            });
                                            return ex;
                                        }
                                        if (ex.exercise1.numSets !== undefined && ex.exercise1.numSets !== itemNumSets) {
                                            Toast.show({
                                                type: 'error',
                                                text1: 'Error',
                                                text2: 'Must have the same number of sets',
                                            });
                                            return ex;
                                        }
                                        return {exercise1: ex.exercise1, exercise2: {id: ex.exercise2.id, name: item, numSets: itemNumSets}};
                                    }
                                }
                                return ex;
                            }
                            )]});
                            closeSheet(exerciseBottomSheetRef);
                        }}>
                            <Text style={{...styles.itemText, padding: 20, textAlign: 'center'}}>{item}</Text>
                        </TouchableOpacity>
                    )} 
                    keyExtractor={(_, index) => index.toString()}
                />
            </BottomSheet>
        </View>
    );
}

type exerciseDataType = {
    id: number,
    name: string,
}

type supersetDataType = {
    exercise1: {
        id: number,
        name: string,
        numSets?: number,
    },
    exercise2: {
        id: number,
        name: string,
        numSets?: number,
    }
}

type dayDataType = {
    name: string,
    color: string,
    exercises: (exerciseDataType | supersetDataType)[],
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
