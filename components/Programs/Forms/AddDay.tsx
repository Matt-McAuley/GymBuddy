import {View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput} from "react-native";
import {Dropdown} from "react-native-element-dropdown";
import {useProgramStore, useStore} from "@/store";
import {useState} from "react";
import {createNewDay, getAccessoryExercises, getPrimaryExercises} from "@/db/programDBFunctions";
import Toast from 'react-native-toast-message';

export default function AddDay() {
    const {setAddDayForm} = useProgramStore();
    const {db} = useStore();
    const [dayData, setDayData] = useState<dayDataType>({
        name: '', color: '', primary_exercise: '', accessory_exercise_1: '', accessory_exercise_2: '', accessory_exercise_3: '',
        accessory_exercise_4: '', superset_1: ['', ''], superset_2: ['', '']});
    const primaryExercises = getPrimaryExercises(db);
    const accessoryExercises = getAccessoryExercises(db);

    return (
        <ScrollView className={'p-4'}>
            <TouchableOpacity className={'h-15 bg-red-500 mb-4 p-3 w-20 self-end'}
                              onPress={() => {setAddDayForm(false)}}>
                <Text className={'text-center text-4xl color-white font-bold'}>X</Text>
            </TouchableOpacity>
            <TextInput
                className={'h-28 w-full text-center border-4 rounded-xl text-4xl font-bold mb-3 bg-white'}
                onChangeText={(text) => setDayData({...dayData, name: text})}
                placeholder={'Name'}
                placeholderTextColor={'black'}>
            </TextInput>
            <Dropdown style={styles.dropdown} selectedTextStyle={{...styles.selected, color:dayData.color.toLowerCase()}} placeholderStyle={styles.placeholder}
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
            <Dropdown style={styles.dropdown} selectedTextStyle={styles.selected} placeholderStyle={styles.placeholder}
                 label={'Primary Exercise'}
                 data={primaryExercises.map((pe : string) => ({label: pe, value: pe}))}
                 labelField='label' valueField='value' placeholder={`Primary Exercise`}
                 value={dayData.primary_exercise} renderRightIcon={() => null}
                 renderItem={(item) => (
                     <View style={styles.item}>
                         <Text style={styles.itemText}>{item.label}</Text>
                     </View>)}
                 onChange={(item) => {setDayData({...dayData, primary_exercise: item.value})}}/>
            {
                [1, 2, 3, 4].map((num) => {
                    return <Dropdown key={num + 'ae'} style={styles.dropdown} selectedTextStyle={styles.selected} placeholderStyle={styles.placeholder}
                                     label={`Accessory Exercise ${num}`}
                                     data={accessoryExercises.map((ae) => ({label: ae, value: ae}))}
                                     labelField='label' valueField='value' placeholder={`Accessory ${num}`}
                                     value={dayData[`accessory_exercise_${num}`]} renderRightIcon={() => null}
                                     renderItem={(item) => (
                                         <View style={styles.item}>
                                             <Text style={styles.itemText}>{item.label}</Text>
                                         </View>)}
                                     onChange={(item) => {setDayData({...dayData, [`accessory_exercise_${num}`]: item.value})}}/>
                })
            }
            {
                [1, 2].map((num) => {
                    return (
                        <View className={''}>
                            <Dropdown key={num + 'ss1'} style={styles.dropdown} selectedTextStyle={styles.selected} placeholderStyle={styles.placeholder}
                                         label={`Superset ${num} Exercise 1`}
                                         data={accessoryExercises.map((se) => ({label: se, value: se}))}
                                         labelField='label' valueField='value' placeholder={`Superset ${num} Exercise 1`}
                                         value={dayData[`superset_${num}`][0]} renderRightIcon={() => null}
                                         renderItem={(item) => (
                                             <View style={styles.item}>
                                                 <Text style={styles.itemText}>{item.label}</Text>
                                             </View>)}
                                         onChange={(item) => {setDayData({...dayData, [`superset_${num}`]: [item.value, dayData.superset_1[1]]})}}/>
                            <Dropdown key={num + 'ss2'} style={styles.dropdown} selectedTextStyle={styles.selected} placeholderStyle={styles.placeholder}
                                      label={`Superset ${num} Exercise 2`}
                                      data={accessoryExercises.map((se) => ({label: se, value: se}))}
                                      labelField='label' valueField='value' placeholder={`Superset ${num} Exercise 2`}
                                      value={dayData[`superset_${num}`][1]} renderRightIcon={() => null}
                                      renderItem={(item) => (
                                          <View style={styles.item}>
                                              <Text style={styles.itemText}>{item.label}</Text>
                                          </View>)}
                                      onChange={(item) => {setDayData({...dayData, [`superset_${num}`]: [dayData.superset_1[0], item.value]})}}/>
                        </View>
                    );
                })
            }
            <TouchableOpacity className={'h-15 bg-green-500 mb-4 p-3 w-full'}
                              onPress={() => {
                                  const result = createNewDay(db, dayData.name, dayData.color, dayData.primary_exercise, dayData.accessory_exercise_1,
                                      dayData.accessory_exercise_2, dayData.accessory_exercise_3, dayData.accessory_exercise_4,
                                      dayData.superset_1, dayData.superset_2);
                                  if (result == 'success') {
                                      Toast.show({
                                          type: 'success',
                                          text1: 'Success',
                                          text2: 'Day Created',
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
                                  setAddDayForm(false);
                              }}>
                <Text className={'text-center text-4xl color-white font-bold'}>Submit</Text>
            </TouchableOpacity>
        </ScrollView>
    );
}

type dayDataType = {
    name: string,
    color: string,
    primary_exercise: string,
    accessory_exercise_1: string,
    accessory_exercise_2: string,
    accessory_exercise_3: string,
    accessory_exercise_4: string,
    superset_1: string[],
    superset_2: string[],
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
