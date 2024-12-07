import {useMusicStore} from "@/store";
import {Image, Text, View} from "react-native";
import {useEffect, useState} from "react";
import BackgroundTimer from "react-native-background-timer";

export default function MusicControl() {
    const {accessToken} = useMusicStore();
    const [currentlyPlaying, setCurrentlyPlaying] = useState<currentlyPlayingType | null>(null);

    useEffect(() => {
        const intervalId = setInterval(() => {
            fetch('https://api.spotify.com/v1/me/player/currently-playing', {
                headers: {
                    Authorization: 'Bearer ' + accessToken!,
                }
            }).then(response => {
                if (response.status === 429) {
                    console.log("Rate limited");
                    return null;
                }
                return response.json();
            })
                .then(data => {
                    if (data === null) return;
                    setCurrentlyPlaying(data);
                })
                .catch(e => console.log(e));
        }, 1000);
    }, []);

    return (
        <View className={'flex justify-center items-center h-full gap-4'}>
            <Text className={'text-center text-5xl font-bold'}>{currentlyPlaying?.item?.name}</Text>
            <Image style={{height: 300, width: 300}} source={{uri: currentlyPlaying?.item?.album.images[0].url}}/>
            <Text className={'text-2xl'}>{currentlyPlaying?.is_playing ? "Playing" : "Paused"}</Text>
            <Text className={'text-2xl'}>{(currentlyPlaying?.progress_ms !== undefined) ? (Math.round(currentlyPlaying?.progress_ms / 1000)) : null}</Text>
        </View>
    )
}

type currentlyPlayingType = {
    is_playing: boolean,
    progress_ms: number,
    item: {
        name: string,
        duration_ms: number,
        album: {
            images: {
                url: string,
            }[]
        }
    }
}