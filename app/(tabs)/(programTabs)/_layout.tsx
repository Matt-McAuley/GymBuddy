import { Tabs } from 'expo-router';
import React from 'react';
import {TouchableOpacity} from "react-native";
import {useProgramStore} from "@/store";

export default function ProgramNavLayout() {
    const {setAddProgramForm, setEditProgram, setAddExerciseForm, setEditExercise, setAddDayForm, setEditDay} = useProgramStore();

    return (
        <Tabs screenOptions={{
            tabBarPosition: 'top',
            headerShown: false,
            tabBarStyle: {
                height: 50,
                paddingTop: 0,
            },
            tabBarItemStyle: {
                padding: 0,
                margin: 0,
                borderRightWidth: 2,
                borderColor: 'black',
            },
            tabBarLabelStyle: {
                margin: 0,
                padding: 5,
                fontSize: 20,
                fontWeight: 'bold',
            },
            tabBarIconStyle: {
                display: 'none',
            },
            tabBarButton: (props) => (
                <TouchableOpacity
                    {...props}
                    onPress={(ev) => {
                        props.onPress?.(ev);
                        setAddProgramForm(false);
                        setEditProgram(null);
                        setAddExerciseForm(false);
                        setEditExercise(null);
                        setAddDayForm(false);
                        setEditDay(null);
                    }}/>
            )
        }}>
            <Tabs.Screen name="programs" options={{title: 'Programs'}}/>
            <Tabs.Screen name="days" options={{title: 'Days'}}/>
            <Tabs.Screen name="exercises" options={{title: 'Exercises'}}/>
        </Tabs>
    );
}
