import {Text, View} from "react-native";

export default function Header() {
  return (
    <View className={'flex-auto justify-end items-center h-32 bg-gray-500 pb-5'}>
            <Text className={"text-black-500 font-extrabold text-5xl"}>GymBuddy</Text>
    </View>
  );
}