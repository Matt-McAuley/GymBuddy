import { View } from "react-native";
import Timer from "@/components/Timer";

export default function Index() {
  return (
    <View className={'flex-1 flex-col justify-start items-center p-3'}>
        <Timer />
    </View>
  );
}
