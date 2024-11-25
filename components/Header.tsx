import {Image, Text, View} from "react-native";

export default function Header() {
  return (
    <View className={'flex-row justify-center items-end h-36 bg-gray-500 pb-5'}>
        <Image className={"h-16 w-16"} source={require("@/assets/images/LiftingLogo.png")}/>
        <Text className={"text-black-500 font-extrabold text-5xl"}>GymBuddy</Text>
        <Image className={"h-16 w-16"} source={require("@/assets/images/LiftingLogo.png")}/>
    </View>
  );
}