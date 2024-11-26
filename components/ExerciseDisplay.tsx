import {View, Text, Image, TouchableOpacity, StyleSheet} from "react-native";
import {useStore} from "@/store";
import {superSetType} from "@/types/programType";
import { Dropdown } from 'react-native-element-dropdown'
import {useEffect, useState} from "react";

export default function ExerciseDisplay() {
    const {set, nextExerciseHandler, prevExerciseHandler, isAccessoryExercise,
        isPrimaryExercise, isSuperSet, currentScheme, setCurrentScheme} = useStore();
    const exercise = useStore((state) => state.exercise());
    const prevExercise = useStore((state) => state.prevExercise());
    const nextExercise = useStore((state) => state.nextExercise());

    const superSetNameDisplay = (superSet : superSetType) => {
        return superSet.exercise1.name.split(' ').map((s) => s[0]).join('') + ' & '
            + superSet.exercise2.name.split(' ').map((s) => s[0]).join('');
    }

    const superSetWeightDisplay = (superSet : superSetType) => {
        return superSet.exercise1.weight + ' | ' + superSet.exercise2.weight;
    }

    const getWeight = () => {
        if (isPrimaryExercise(exercise)) {
            if (currentScheme === '5 x 5') {
                return [exercise.weight_1, exercise.weight_1, exercise.weight_1, exercise.weight_1, exercise.weight_1];
            }
            else if (currentScheme === '5 x 3') {
                return [exercise.weight_2, exercise.weight_2, exercise.weight_2, exercise.weight_2, exercise.weight_2];
            }
            else {
                return [exercise.weight_1, exercise.weight_2, exercise.weight_3, exercise.weight_2, exercise.weight_1];
            }
        } else if (isAccessoryExercise(exercise)) {
            return new Array(5).fill(exercise.weight);
        } else {
            return new Array(5).fill(exercise.exercise1.weight + '|' + exercise.exercise2.weight);
        }
    }
    const [weight, setWeight] = useState(getWeight());

    useEffect(() => {
        setWeight(getWeight());
    }, [exercise, currentScheme]);

    return (isPrimaryExercise(exercise)) ? (
        <View className={'flex-col justify-center items-center h-60 w-full bg-amber-50 border-4 border-black p-2 rounded-2xl'}>
            <Text className={'font-bold text-5xl'}>{exercise.name} : {weight[set-1]}</Text>
            <View className={'flex-row justify-between items-center w-full'}>
                <View className={'flex-col justify-center items-center w-30'}>
                    <TouchableOpacity onPress={prevExerciseHandler}>
                        <Image className={"h-18 w-18"}
                               source={require("@/assets/images/exerciseDisplay/leftArrow.png")}/>
                    </TouchableOpacity>
                    <Text className={'text-2xl'}>{(prevExercise == null) ? 'None' : (isPrimaryExercise(prevExercise)) ?
                    prevExercise.name : (isAccessoryExercise(prevExercise)) ? prevExercise.name : superSetNameDisplay(prevExercise)}</Text>
                    <Text className={'text-2xl'}>{(prevExercise == null) ? 'X' : (isPrimaryExercise(prevExercise)) ?
                        prevExercise.weight_1: (isAccessoryExercise(prevExercise)) ? prevExercise.weight : superSetWeightDisplay(prevExercise)}</Text>
                </View>
                <Dropdown style={styles.dropdown} selectedTextStyle={styles.selected}
                    label={'Scheme'}
                    data={[
                        {label: '5 x 5', value: '5 x 5'},
                        {label: '5 x 3', value: '5 x 3'},
                        {label: '5 3 1', value: '5 3 1'},
                    ]}
                    labelField='label' valueField='value' placeholder={currentScheme}
                    value={currentScheme} renderRightIcon={() => null}
                      renderItem={(item) => (
                      <View style={styles.item}>
                          <Text style={styles.itemText}>{item.label}</Text>
                      </View>)}
                    onChange={(item) => setCurrentScheme(item.value)} />
                <View className={'flex-col justify-center items-center w-30'}>
                    <TouchableOpacity onPress={nextExerciseHandler}>
                        <Image className={"h-18 w-18"}
                               source={require("@/assets/images/exerciseDisplay/rightArrow.png")}/>
                    </TouchableOpacity>
                    <Text className={'text-2xl'}>{(nextExercise == null) ? 'None' : (isPrimaryExercise(nextExercise)) ?
                        nextExercise.name : (isAccessoryExercise(nextExercise)) ? nextExercise.name : superSetNameDisplay(nextExercise)}</Text>
                    <Text className={'text-2xl'}>{(nextExercise == null) ? 'X' : (isPrimaryExercise(nextExercise)) ?
                        nextExercise.weight_1: (isAccessoryExercise(nextExercise)) ? nextExercise.weight : superSetWeightDisplay(nextExercise)}</Text>
                </View>
            </View>
        </View>

    ) : (isAccessoryExercise(exercise)) ? (
        <View className={'flex-col justify-center items-center h-60 w-full bg-amber-50 border-4 border-black p-2 rounded-2xl'}>
            <Text className={'font-bold text-5xl'}>{exercise.name} : {exercise.weight}</Text>
            <View className={'flex-row justify-between items-center w-full'}>
                <View className={'flex-col justify-center items-center w-40'}>
                    <TouchableOpacity onPress={prevExerciseHandler}>
                        <Image className={"h-18 w-18"}
                               source={require("@/assets/images/exerciseDisplay/leftArrow.png")}/>
                    </TouchableOpacity>
                    <Text className={'text-2xl'}>{(prevExercise == null) ? 'None' : (isPrimaryExercise(prevExercise)) ?
                        prevExercise.name : (isAccessoryExercise(prevExercise)) ? prevExercise.name : superSetNameDisplay(prevExercise)}</Text>
                    <Text className={'text-2xl'}>{(prevExercise == null) ? 'X' : (isPrimaryExercise(prevExercise)) ?
                        prevExercise.weight_1: (isAccessoryExercise(prevExercise)) ? prevExercise.weight : superSetWeightDisplay(prevExercise)}</Text>
                </View>
                <View className={'flex-col justify-center items-center w-40'}>
                    <TouchableOpacity onPress={nextExerciseHandler}>
                        <Image className={"h-18 w-18"}
                               source={require("@/assets/images/exerciseDisplay/rightArrow.png")}/>
                    </TouchableOpacity>
                    <Text className={'text-2xl'}>{(nextExercise == null) ? 'None' : (isPrimaryExercise(nextExercise)) ?
                        nextExercise.name : (isAccessoryExercise(nextExercise)) ? nextExercise.name : superSetNameDisplay(nextExercise)}</Text>
                    <Text className={'text-2xl'}>{(nextExercise == null) ? 'X' : (isPrimaryExercise(nextExercise)) ?
                        nextExercise.weight_1: (isAccessoryExercise(nextExercise)) ? nextExercise.weight : superSetWeightDisplay(nextExercise)}</Text>
                </View>
            </View>
        </View>

    ) : (isSuperSet(exercise)) ? (
        <View className={'flex-col justify-center items-center h-70 w-full bg-amber-50 border-4 border-black p-2 rounded-2xl'}>
            <Text className={'font-bold text-4xl'}>{exercise.exercise1.name} : {exercise.exercise1.weight}</Text>
            <Text className={'font-bold text-4xl'}>{exercise.exercise2.name} : {exercise.exercise2.weight}</Text>
            <View className={'flex-row justify-between items-center w-full'}>
                <View className={'flex-col justify-center items-center w-40'}>
                    <TouchableOpacity onPress={prevExerciseHandler}>
                        <Image className={"h-18 w-18"}
                               source={require("@/assets/images/exerciseDisplay/leftArrow.png")}/>
                    </TouchableOpacity>
                    <Text className={'text-2xl'}>{(prevExercise == null) ? 'None' : (isPrimaryExercise(prevExercise)) ?
                        prevExercise.name : (isAccessoryExercise(prevExercise)) ? prevExercise.name : superSetNameDisplay(prevExercise)}</Text>
                    <Text className={'text-2xl'}>{(prevExercise == null) ? 'X' : (isPrimaryExercise(prevExercise)) ?
                        prevExercise.weight_1: (isAccessoryExercise(prevExercise)) ? prevExercise.weight : superSetWeightDisplay(prevExercise)}</Text>
                </View>
                <View className={'flex-col justify-center items-center w-40'}>
                    <TouchableOpacity onPress={nextExerciseHandler}>
                        <Image className={"h-18 w-18"}
                               source={require("@/assets/images/exerciseDisplay/rightArrow.png")}/>
                    </TouchableOpacity>
                    <Text className={'text-2xl'}>{(nextExercise == null) ? 'None' : (isPrimaryExercise(nextExercise)) ?
                        nextExercise.name : (isAccessoryExercise(nextExercise)) ? nextExercise.name : superSetNameDisplay(nextExercise)}</Text>
                    <Text className={'text-2xl'}>{(nextExercise == null) ? 'X' : (isPrimaryExercise(nextExercise)) ?
                        nextExercise.weight_1: (isAccessoryExercise(nextExercise)) ? nextExercise.weight : superSetWeightDisplay(nextExercise)}</Text>
                </View>
            </View>
        </View>
    ) : null;
}

const styles = StyleSheet.create({
    dropdown: {
        width: 100,
        height: 80,
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 10,
        borderColor: 'black',
        borderWidth: 3,
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
    }
});
