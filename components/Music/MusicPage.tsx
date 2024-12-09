import MusicControl from "@/components/Music/MusicControl";
import {View} from "react-native";


export default function MusicPage() {
    return (
        <View className={"flex-col items-center justify-center"}>
            <MusicControl />
        </View>
    );
}