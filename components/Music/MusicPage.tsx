import MusicControl from "@/components/Music/MusicControl";
import {ScrollView, View} from "react-native";


export default function MusicPage() {
    return (
        <ScrollView contentContainerStyle={{justifyContent: 'center', alignItems: 'center'}} className={"flex-col"}>
            <MusicControl />
        </ScrollView>
    );
}