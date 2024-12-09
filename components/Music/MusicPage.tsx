import MusicControl from "@/components/Music/MusicControl";
import {ScrollView, Text, Touchable, TouchableOpacity, View} from "react-native";
import Playlists from "@/components/Music/Playlists";
import {useMusicStore} from "@/store";
import {useEffect} from "react";
import Queue from "@/components/Music/Queue";


export default function MusicPage() {
    const { inQueue, active, setActive, accessToken } = useMusicStore();

    useEffect(() => {
        const intervalId = setInterval(() => {
            fetch('https://api.spotify.com/v1/me/player', {
                headers: {
                    Authorization: 'Bearer ' + accessToken!,
                }
            }).then(response => {
                if (response.status === 429) {
                    return null;
                }
                if (response.status === 204) {
                    setActive(false);
                    return null;
                }
                return response.json();
            })
                .then(data => {
                    if (data === null) return;
                    setActive(true);
                }).catch(e => console.log(e));
        }, 1000);
        return () => clearInterval(intervalId);
    }, []);

    return (active) ?
        (!inQueue) ? (
        <ScrollView contentContainerStyle={{justifyContent: 'center', alignItems: 'center'}} className={"flex-col"}>
            <MusicControl />
            <Playlists />
        </ScrollView>
    ) : (
            <Queue />
        )
            : (
        <View className={'h-full flex justify-center items-center p-5'}>
            <Text className={'text-center text-5xl font-bold'}>No music playing</Text>
        </View>
    );
}