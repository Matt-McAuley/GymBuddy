import {View, Text, StyleSheet, TouchableOpacity, TextInput} from "react-native";
import {useProgramStore, useStore} from "@/store";
import {useRef, useState} from "react";
import {createNewProgram, getDayNamesColors} from "@/db/programDBFunctions";
import Toast from 'react-native-toast-message';
import { MaterialIcons } from '@expo/vector-icons';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import DraggableFlatList, { ScaleDecorator, RenderItemParams } from 'react-native-draggable-flatlist';
import BottomSheet, { BottomSheetFlatList } from "@gorhom/bottom-sheet";

export default function AddProgram() {
    const {setAddProgramForm} = useProgramStore();
    const {db} = useStore();
    const dayNamesColors = getDayNamesColors(db);
    const [programData, setProgramData] = useState<programDataType>({name: "", days: []});
    const [index, setIndex] = useState(0);
    const dayBottomSheetRef = useRef<BottomSheet>(null);
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

    const HeaderComponent = () => (
        <View className={'p-4'}>
            <TouchableOpacity className={'h-15 bg-red-500 mb-4 p-3 w-20 self-end'} onPress={() => {setAddProgramForm(false)}}>
                <Text className={'text-center text-4xl color-white font-bold'}>X</Text>
            </TouchableOpacity>
            <Text className="text-3xl font-bold text-start mb-2">Program Name</Text>
            <TextInput
                className={'h-28 w-full text-center border-4 rounded-xl text-3xl font-bold mb-4 bg-white'}
                onEndEditing={(e) => setProgramData({...programData, name: e.nativeEvent.text})}
                placeholder={'Enter Program Name'}
                defaultValue={programData.name}
                placeholderTextColor={'gray'}>
            </TextInput>
        </View>
    );

    const FooterComponent = () => (
        <View className={'p-4'}>
            <TouchableOpacity onPress={() => {
                if (dayNamesColors.length === 0) {
                    Toast.show({
                        type: 'error',
                        text1: 'Error',
                        text2: 'You must add days before you can create a program!',
                    });
                    return;
                }
                setProgramData({...programData, days: [...(programData.days), {id: index, name: '', color: ''}]});
                setIndex(index + 1);
            }}
                className={'w-full h-25 border-4 border-dashed border-gray-500 rounded-2xl mb-5 flex-row justify-around items-center'}>
                <Text className={'text-4xl text-center font-bold color-gray-500'}>Add New Day</Text>
            </TouchableOpacity>
            <TouchableOpacity className={'h-15 bg-green-500 mb-4 p-3 w-full'}
                onPress={() => {
                    const dayNames = programData.days.map(day => day.name.trim());
                    const result = createNewProgram(db, programData.name.trim(), dayNames);
                    if (result == 'success') {
                        Toast.show({
                            type: 'success',
                            text1: 'Success',
                            text2: 'Program Created',
                            text1Style: {fontSize: 30},
                            text2Style: {fontSize: 30},
                        });
                        setAddProgramForm(false);
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

    const renderItem = ({ item, drag, isActive, getIndex }: RenderItemParams<dayDataType>) => {
        return (
            <ScaleDecorator>
                <View key={`day-${item.id}`} className="w-full mb-3 relative px-4">
                    <Swipeable overshootFriction={6} friction={1.5} renderRightActions={() => (
                        <View className="w-25 h-22 bg-red-500 justify-center items-center mr-1 rounded-2xl">
                            <TouchableOpacity
                                className="w-full h-full justify-center items-center hover:opacity-70"
                                onPress={() => {
                                    const index = getIndex() ?? -1;
                                    const updatedProgram = programData.days.filter((_, i) => i !== index);
                                    setProgramData({ ...programData, days: updatedProgram });
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
                                        openSheet(dayBottomSheetRef);
                                    }}>
                                    <Text className="text-3xl text-center font-bold" style={{color: item.color.toLowerCase()}}>{item.name}</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </Swipeable>
                </View>
            </ScaleDecorator>
        );
    };

    return (
        <View>
            <DraggableFlatList
                data={programData.days}
                onDragEnd={({ data }) => setProgramData({ ...programData, days: data })}
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
                        bottom: 0,
                        backgroundColor: 'rgba(0,0,0,0.25)',
                    }}
                    activeOpacity={1}
                    onPress={() => {
                        closeSheet(dayBottomSheetRef);
                    }}
                />
            )}
            <BottomSheet ref={dayBottomSheetRef} index={-1} snapPoints={["50%"]} enableDynamicSizing={false} enableOverDrag={true}>
                <View className="p-4">
                    <BottomSheetFlatList 
                        data={dayNamesColors} 
                        renderItem={({item}) => (
                            <TouchableOpacity 
                                className="p-4"
                                onPress={() => {
                                    setProgramData({...programData, days: [...programData.days.map((day) => 
                                        day.id === currentlyEditingIndex 
                                            ? {...day, name: item.name, color: item.color}
                                            : day
                                    )]});
                                    closeSheet(dayBottomSheetRef);
                                }}>
                                <Text style={{...styles.itemText, color: item.color.toLowerCase(), textAlign: 'center'}}>
                                    {item.name}
                                </Text>
                            </TouchableOpacity>
                        )} 
                        keyExtractor={(item) => item.name}
                    />
                </View>
            </BottomSheet>
        </View>
    );
}

type dayDataType = {
    id: number,
    name: string,
    color: string,
}

type programDataType = {
    name: string,
    days: dayDataType[],
}

const styles = StyleSheet.create({
    itemText: {
        fontSize: 25,
        color: 'black',
        fontWeight: 'bold',
    },
});