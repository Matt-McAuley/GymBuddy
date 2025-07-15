import { Tabs } from 'expo-router';
import React from 'react';
import { Image } from 'react-native';

import { HapticTab } from '@/components/HapticTab';

export default function TabLayout() {

  return (
    <Tabs
      screenOptions={{
      headerShown: false,
      tabBarButton: HapticTab,
      tabBarActiveTintColor: 'black',
          tabBarInactiveTintColor: 'gray',
      }}>
      <Tabs.Screen name="index" options={{
          title: 'Home',
          tabBarIcon: () => <Image className={"h-10 w-10"} source={require("@/assets/images/tabs/HomeIcon.png")} />,
        }}
      />
        <Tabs.Screen name="(programTabs)" options={{
            title: 'Programs',
            tabBarIcon: () => <Image className={"h-10 w-10"} source={require("@/assets/images/tabs/ProgrammingIcon.png")} />,
            }}
        />
        <Tabs.Screen name="music" options={{
            title: 'Music',
            tabBarIcon: () => <Image className={"h-10 w-10"} source={require("@/assets/images/tabs/MusicIcon.png")} />,
        }}
        />
        <Tabs.Screen name="timer" options={{
            title: 'Timer',
            tabBarIcon: () => <Image className={"h-10 w-10"} source={require("@/assets/images/tabs/MusicIcon.png")} />,
        }}
        />
    </Tabs>
  );
}
