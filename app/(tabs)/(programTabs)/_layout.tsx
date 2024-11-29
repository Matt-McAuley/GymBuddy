import { Tabs } from 'expo-router';
import React from 'react';

export default function ProgramNavLayout() {

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
        }}>
            <Tabs.Screen name="programs" options={{title: 'Programs'}}/>
            <Tabs.Screen name="days" options={{title: 'Days'}}/>
            <Tabs.Screen name="exercises" options={{title: 'Exercises'}}/>
        </Tabs>
    );
}
