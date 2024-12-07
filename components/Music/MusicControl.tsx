import {useMusicStore} from "@/store";
import {Text, View} from "react-native";
import {useEffect, useState} from "react";

export default function MusicControl() {
    const {accessToken} = useMusicStore();
    const [currentlyPlaying, setCurrentlyPlaying] = useState<currentlyPlayingType | null>(null);

    useEffect(() => {
        fetch('https://api.spotify.com/v1/me/player/currently-playing', {
            headers: {
                Authorization: 'Bearer ' + accessToken!,
            }
        }).then(response => response.json())
            .then(data => {
                setCurrentlyPlaying(data);
            })
            .catch(e => console.log(e));
    }, []);

    return (
        <View>
            <Text>{currentlyPlaying?.item?.name}</Text>
        </View>
    )
}

type currentlyPlayingType = {
    is_playing: boolean,
    progress_ms: number,
    item: {
        name: string,
        duration_ms: number,
    }
}