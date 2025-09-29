import {View, Text, StyleSheet, Button, TouchableOpacity, TextInput} from "react-native";
import {useProgramStore, useStore} from "@/store";
import {useRef, useState} from "react";
import {createNewDay, getExercisesAndSets} from "@/db/programDBFunctions";
import Toast from 'react-native-toast-message';
import { MaterialIcons } from '@expo/vector-icons';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import DraggableFlatList, { ScaleDecorator, RenderItemParams } from 'react-native-draggable-flatlist';
import BottomSheet, { BottomSheetFlatList } from "@gorhom/bottom-sheet";

export default function AddDay() {
    const {setAddDayForm} = useProgramStore();
    const {db} = useStore();
    const exercisesAndSets = getExercisesAndSets(db);
    const exercises = exercisesAndSets.map(e => e.name);
    const [dayData, setDayData] = useState<dayDataType>({name: "", color: "Red", exercises: []});
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
        return 'exercise_1' in item;
    }

    const HeaderComponent = () => (
        <View className={'p-4'}>
            <TouchableOpacity className={'h-15 bg-red-500 mb-4 p-3 w-20 self-end'} onPress={() => {setAddDayForm(false)}}>
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
                setDayData({...dayData, exercises: [...(dayData.exercises), {id: index, name: ','}]});
                setIndex(index + 1);
            }}
                className={'w-full h-25 border-4 border-dashed border-gray-500 rounded-2xl mb-5 flex-row justify-around items-center'}>
                <Text className={'text-4xl text-center font-bold color-gray-500'}>Add New Superset</Text>
            </TouchableOpacity>
            <TouchableOpacity className={'h-15 bg-green-500 mb-4 p-3 w-full'}
                onPress={() => {
                    const exercisesNames = dayData.exercises.map((e) => {
                        if (isSuperSet(e)) {
                            return e.exercise_1 + ',' + e.exercise_2;
                        }
                        return e.name;
                    });
                    const result = createNewDay(db, dayData.name.trim(), dayData.color.toLowerCase(), exercisesNames);
                    if (result == 'success') {
                        Toast.show({
                            type: 'success',
                            text1: 'Success',
                            text2: 'Day Created',
                            text1Style: {fontSize: 30},
                            text2Style: {fontSize: 30},
                        });
                        setAddDayForm(false);
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
                        <View className="w-25 h-22 bg-red-500 justify-center items-center mr-1 rounded-xl">
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
                            <View className="flex-row justify-around items-center flex-1 bg-gray-100 rounded-xl self-end">
                                <TouchableOpacity className={'border-4 rounded-xl font-bold justify-center items-center bg-white p-5 h-22 w-[97%]'}
                                    onPress={() => {
                                        setCurrentlyEditingIndex(item.id ?? -1);
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
        <View>
            <Text>Superset</Text>
        </View>;
    };

    return (
        <View>
            <DraggableFlatList
                data={dayData.exercises}
                onDragEnd={({ data }) => setDayData({ ...dayData, exercises: data })}
                keyExtractor={(item) => `draggable-item-${item.id}`}
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
                        bottom: '50%',
                        backgroundColor: 'rgba(0,0,0,0.25)',
                        zIndex: 1
                    }}
                    activeOpacity={1}
                    onPress={() => {
                        closeSheet(colorBottomSheetRef);
                        closeSheet(exerciseBottomSheetRef);
                    }}
                />
            )}
            <BottomSheet ref={colorBottomSheetRef} index={-1} snapPoints={["50%"]} enableDynamicSizing={false} enableOverDrag={false}>
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
            <BottomSheet ref={exerciseBottomSheetRef} index={-1} snapPoints={["50%"]} enableDynamicSizing={false} enableOverDrag={false}>
                <BottomSheetFlatList 
                    data={exercises} 
                    renderItem={({item}) => (
                        <TouchableOpacity onPress={() => {
                            setDayData({...dayData, exercises: [...dayData.exercises.map(ex => ex.id === currentlyEditingIndex ? { id: currentlyEditingIndex, name: item } : ex)]});
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
    id: number,
    exercise_1: string,
    exercise_2: string,
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
