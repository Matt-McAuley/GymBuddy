import {View, Text, ScrollView, TouchableOpacity} from "react-native";
import {useEffect, useState} from "react";
import * as SQLite from 'expo-sqlite';
import { useDrizzleStudio } from "expo-drizzle-studio-plugin";
import {useStore} from "@/store";

export default function Exercises() {

    return (
            <View className={'w-full h-full flex justify-center items-center'}>
                <Text className={'text-center text-6xl h-full w-full'}>Programs</Text>
            </View>
    );
}