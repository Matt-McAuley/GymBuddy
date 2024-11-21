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
      tabBarLabelStyle: {
        color: 'black',
      },
      }}>
      <Tabs.Screen name="index" options={{
          title: 'Home',
          tabBarIcon: () => <Image className={"h-10 w-10"} source={require("@/assets/images/tabs/HomeIcon.png")} />,
        }}
      />
    </Tabs>
  );
}
