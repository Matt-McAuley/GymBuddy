import { View } from "react-native";
import Timer from "@/components/Timer";
import Counter from "@/components/Counter";

export default function Index() {
  return (
    <View className={'flex-1 flex-col justify-start items-center p-3 gap-4'}>
        <Timer startTime={30}/>
        <Counter sets={5} reps={[5, 3, 1, 3, 5]}/>
    </View>
  );
}
