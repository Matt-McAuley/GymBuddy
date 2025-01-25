import {View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput} from "react-native";
import {Dropdown} from "react-native-element-dropdown";
import {useProgramStore, useStore} from "@/store";
import {useState} from "react";
import {
    deleteDay,
    getAccessoryExercises,
    getDayByName,
    getPrimaryExercises,
    replaceDay,
} from "@/db/programDBFunctions";
import Toast from 'react-native-toast-message';
import {getProgram} from "@/db/dbFunctions";

export default function EditDay() {
    const {setEditDay, editDay} = useProgramStore();
    const {db, setProgram, setCurrentDay, reset} = useStore();
    const [dayData, setDayData] = useState<dayDataType>(getDayByName(db, editDay!));
    const originalName = getDayByName(db, editDay!).name;
    const primaryExercises = getPrimaryExercises(db);
    const accessoryExercises = getAccessoryExercises(db);

    return (
        <ScrollView className={'p-4'}>
            <TouchableOpacity className={'h-15 bg-red-500 mb-4 p-3 w-20 self-end'}
                              onPress={() => {setEditDay(null)}}>
                <Text className={'text-center text-4xl color-white font-bold'}>X</Text>
            </TouchableOpacity>
            <TextInput
                className={'h-28 w-full text-center border-4 rounded-xl text-4xl font-bold mb-3 bg-white'}
                onChangeText={(text) => setDayData({...dayData, name: text})}
                value={dayData.name!}>
            </TextInput>
            <Dropdown style={styles.dropdown} selectedTextStyle={{...styles.selected, color:dayData.color?.toLowerCase()}} placeholderStyle={styles.placeholder}
                      label={'colors'}
                      data={['Red', 'Orange', 'Yellow', 'Green', 'Blue', 'Purple', 'Pink', 'Brown']
                          .map((c) => ({label: c, value: c.toLowerCase()}))}
                      labelField='label' valueField='value' placeholder={`Color`}
                      value={dayData.color} renderRightIcon={() => null}
                      renderItem={(item) => (
                          <View style={styles.item}>
                              <Text style={{...styles.itemText, color: item.label.toLowerCase()}}>{item.label}</Text>
                          </View>)}
                      onChange={(item) => {setDayData({...dayData, color: item.value})}}/>
            <View className={'flex-row'}>
                <Dropdown style={styles.dropdownLeft} selectedTextStyle={styles.selected} placeholderStyle={styles.placeholder}
                          label={'Primary Exercise 1'}
                          data={[{label: 'None', value: null}, ...primaryExercises.map((pe : string) => ({label: pe, value: pe}))]}
                          labelField='label' valueField='value' placeholder={`Primary 1`}
                          value={dayData.primary_exercise_1} renderRightIcon={() => null}
                          renderItem={(item) => (
                              <View style={styles.item}>
                                  <Text style={styles.itemText}>{item.label}</Text>
                              </View>)}
                          onChange={(item) => {setDayData({...dayData, primary_exercise_1: item.value})}}/>
                <Dropdown style={styles.dropdownRight} selectedTextStyle={styles.selected} placeholderStyle={styles.orderPlaceholder}
                          label={'Order'}
                          data={[1, 2, 3, 4, 5, 6, 7, 8].map((order) => ({label: order.toString(), value: order.toString()}))}
                          labelField='label' valueField='value' placeholder={dayData.primary_exercise_1_order?.toString()}
                          value={dayData.primary_exercise_1_order} renderRightIcon={() => null}
                          renderItem={(item) => (
                              <View style={styles.item}>
                                  <Text style={styles.itemText}>{item.label}</Text>
                              </View>)}
                          onChange={(item) => {setDayData({...dayData, primary_exercise_1_order: item.value})}}/>
            </View>
            <View className={'flex-row'}>
                <Dropdown style={styles.dropdownLeft} selectedTextStyle={styles.selected} placeholderStyle={styles.placeholder}
                          label={'Primary Exercise 2'}
                          data={[{label: 'None', value: null}, ...primaryExercises.map((pe : string) => ({label: pe, value: pe}))]}
                          labelField='label' valueField='value' placeholder={`Primary 2`}
                          value={dayData.primary_exercise_2} renderRightIcon={() => null}
                          renderItem={(item) => (
                              <View style={styles.item}>
                                  <Text style={styles.itemText}>{item.label}</Text>
                              </View>)}
                          onChange={(item) => {setDayData({...dayData, primary_exercise_2: item.value})}}/>
                <Dropdown style={styles.dropdownRight} selectedTextStyle={styles.selected} placeholderStyle={styles.orderPlaceholder}
                          label={'Order'}
                          data={[1, 2, 3, 4, 5, 6, 7, 8].map((order) => ({label: order.toString(), value: order.toString()}))}
                          labelField='label' valueField='value' placeholder={dayData.primary_exercise_2_order?.toString()}
                          value={dayData.primary_exercise_2_order} renderRightIcon={() => null}
                          renderItem={(item) => (
                              <View style={styles.item}>
                                  <Text style={styles.itemText}>{item.label}</Text>
                              </View>)}
                          onChange={(item) => {setDayData({...dayData, primary_exercise_2_order: item.value})}}/>
            </View>
            {
                [1, 2, 3, 4].map((num) => {
                    return (
                        <View key={num + 'eaView'} className={'flex-row'}>
                            <Dropdown key={num + 'aeDrop'} style={styles.dropdownLeft} selectedTextStyle={styles.selected} placeholderStyle={styles.placeholder}
                                      label={`Accessory Exercise ${num}`}
                                      data={[{label: 'None', value: null}, ...accessoryExercises.map((ae) => ({label: ae, value: ae}))]}
                                      labelField='label' valueField='value' placeholder={`Accessory ${num}`}
                                      value={dayData[`accessory_exercise_${num}`]} renderRightIcon={() => null}
                                      renderItem={(item) => (
                                          <View style={styles.item}>
                                              <Text style={styles.itemText}>{item.label}</Text>
                                          </View>)}
                                      onChange={(item) => {setDayData({...dayData, [`accessory_exercise_${num}`]: item.value})}}/>
                            <Dropdown key={num + 'aeOrder'} style={styles.dropdownRight} selectedTextStyle={styles.selected} placeholderStyle={styles.orderPlaceholder}
                                      label={'Order'}
                                      data={[1, 2, 3, 4, 5, 6, 7, 8].map((order) => ({label: order.toString(), value: order.toString()}))}
                                      labelField='label' valueField='value' placeholder={dayData[`accessory_exercise_${num}_order`]?.toString()}
                                      value={dayData[`accessory_exercise_${num}_order`]} renderRightIcon={() => null}
                                      renderItem={(item) => (
                                          <View style={styles.item}>
                                              <Text style={styles.itemText}>{item.label}</Text>
                                          </View>)}
                                      onChange={(item) => {setDayData({...dayData, [`accessory_exercise_${num}_order`]: item.value})}}/>
                        </View>
                    );
                })
            }
            {
                [1, 2].map((num) => {
                    return (
                        <View key={num + 'ssView'} className={'flex-row'}>
                            <View key={num + 'ssView2'} className={'w-80 border-black border-4 rounded-2xl bg-white mb-3'}>
                                <Dropdown key={num + 'ss1'} style={styles.ss1DropdownLeft} selectedTextStyle={styles.selected} placeholderStyle={styles.placeholder}
                                          label={`SS ${num} Exercise 1`}
                                          data={[{label: 'None', value: null}, ...accessoryExercises.map((se) => ({label: se, value: se}))]}
                                          labelField='label' valueField='value' placeholder={`SS ${num} Exercise 1`}
                                          value={dayData[`superset_${num}_1`]} renderRightIcon={() => null}
                                          renderItem={(item) => (
                                              <View style={styles.item}>
                                                  <Text style={styles.itemText}>{item.label}</Text>
                                              </View>)}
                                          onChange={(item) => {setDayData({...dayData, [`superset_${num}_1`]: item.value})}}/>
                                <Dropdown key={num + 'ss2'} style={styles.ss2dropdownLeft} selectedTextStyle={styles.selected} placeholderStyle={styles.placeholder}
                                          label={`SS ${num} Exercise 2`}
                                          data={[{label: 'None', value: null}, ...accessoryExercises.map((se) => ({label: se, value: se}))]}
                                          labelField='label' valueField='value' placeholder={`SS ${num} Exercise 2`}
                                          value={dayData[`superset_${num}_2`]} renderRightIcon={() => null}
                                          renderItem={(item) => (
                                              <View style={styles.item}>
                                                  <Text style={styles.itemText}>{item.label}</Text>
                                              </View>)}
                                          onChange={(item) => {setDayData({...dayData, [`superset_${num}_2`]: item.value})}}/>
                            </View>
                            <Dropdown key={num + 'ssOrder'} style={styles.ssDropdownRight} selectedTextStyle={styles.selected} placeholderStyle={styles.orderPlaceholder}
                                      label={'Order'}
                                      data={[1, 2, 3, 4, 5, 6, 7, 8].map((order) => ({label: order.toString(), value: order.toString()}))}
                                      labelField='label' valueField='value' placeholder={dayData[`superset_${num}_order`]?.toString()}
                                      value={dayData[`superset_${num}_order`]} renderRightIcon={() => null}
                                      renderItem={(item) => (
                                          <View style={styles.item}>
                                              <Text style={styles.itemText}>{item.label}</Text>
                                          </View>)}
                                      onChange={(item) => {setDayData({...dayData, [`superset_${num}_order`]: item.value})}}/>
                        </View>
                    );
                })
            }
            <TouchableOpacity className={'h-15 bg-green-500 mb-4 p-3 w-full'}
                              onPress={() => {
                                  const result = replaceDay(db, originalName, dayData.name, dayData.color,
                                      dayData.primary_exercise_1, dayData.primary_exercise_1_order,
                                      dayData.primary_exercise_2, dayData.primary_exercise_2_order,
                                      dayData.accessory_exercise_1, dayData.accessory_exercise_1_order,
                                      dayData.accessory_exercise_2, dayData.accessory_exercise_2_order,
                                      dayData.accessory_exercise_3, dayData.accessory_exercise_3_order,
                                      dayData.accessory_exercise_4, dayData.accessory_exercise_4_order,
                                      dayData.superset_1_1, dayData.superset_1_2, dayData.superset_1_order,
                                      dayData.superset_2_1, dayData.superset_2_2,dayData.superset_2_order);
                                  if (result == 'success') {
                                      Toast.show({
                                          type: 'success',
                                          text1: 'Success',
                                          text2: 'Day Edited',
                                          text1Style: {fontSize: 30},
                                          text2Style: {fontSize: 30},
                                      });
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
                                  setEditDay(null);
                              }}>
                <Text className={'text-center text-4xl color-white font-bold'}>Submit</Text>
            </TouchableOpacity>
            <TouchableOpacity className={'h-15 bg-red-500 mb-4 p-3 w-full'}
                              onPress={() => {
                                  deleteDay(db, dayData.name!);
                                  Toast.show({
                                      type: "success",
                                      text1: "Success",
                                      text2: "Day Deleted",
                                  });
                                  reset();
                                  setProgram(getProgram(db));
                                  setEditDay(null);
                              }}>
                <Text className={'text-center text-4xl color-white font-bold'}>Delete</Text>
            </TouchableOpacity>
        </ScrollView>
    );
}

type dayDataType = {
    name: string | null,
    color: string | null,
    primary_exercise_1: string | null,
    primary_exercise_1_order: number,
    primary_exercise_2: string | null,
    primary_exercise_2_order: number,
    accessory_exercise_1: string | null,
    accessory_exercise_1_order: number,
    accessory_exercise_2: string | null,
    accessory_exercise_2_order: number,
    accessory_exercise_3: string | null,
    accessory_exercise_3_order: number,
    accessory_exercise_4: string | null,
    accessory_exercise_4_order: number,
    superset_1_1: string | null,
    superset_1_2: string | null,
    superset_1_order: number,
    superset_2_1: string | null,
    superset_2_2: string | null,
    superset_2_order: number,
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
