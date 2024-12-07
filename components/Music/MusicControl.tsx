import {useMusicStore} from "@/store";
import {Image, Text, View} from "react-native";
import {useEffect, useState} from "react";
import * as Progress from 'react-native-progress';

export default function MusicControl() {
    const {accessToken} = useMusicStore();
    const [currentlyPlaying, setCurrentlyPlaying] = useState<currentlyPlayingType | null>(null);
    const [previouslyPlayed, setPreviouslyPlayed] = useState<previouslyPlayedType | null>(null);
    const [state, setState] = useState('none'); // none, previous, active

    useEffect(() => {
        const intervalId = setInterval(() => {
            fetch('https://api.spotify.com/v1/me/player', {
                headers: {
                    Authorization: 'Bearer ' + accessToken!,
                }
            }).then(response => {
                if (response.status === 429) {
                    console.log("Rate limited 1");
                    return null;
                }
                if (response.status === 204) {
                    getRecentlyPlayed();
                    return null;
                }
                return response.json();
            })
                .then(data => {
                    if (data === null) return;
                    setState('active');
                    setCurrentlyPlaying(data);
                })
                .catch(e => console.log(e));
        }, 1000);
    }, []);

    const getRecentlyPlayed = async () => {
        fetch('https://api.spotify.com/v1/me/player/recently-played?' + new URLSearchParams({
            limit: '1',
        }), {
            headers: {
                Authorization: 'Bearer ' + accessToken!,
                cache: 'no-store',
            }
        }).then(response => {
            if (response.status === 429) {
                console.log("Rate limited 2");
                return null;
            }
            return response.json();
        }).then(data => {
            if (data.total === 0) {
                return;
            }
            // console.log(data.items.map(((item : previouslyPlayedType)=> item.track.name)));
            setState('previous')
            setPreviouslyPlayed(data.items[0]);
        });
    }

    return (state == 'active') ? (
        <View className={'flex justify-center items-center h-full gap-4'}>
            <Text className={'text-center text-5xl font-bold'}>{currentlyPlaying?.item?.name}</Text>
            <Image style={{height: 300, width: 300}} source={{uri: currentlyPlaying?.item?.album.images[0].url}}/>
            <Text className={'text-2xl'}>{currentlyPlaying?.is_playing ? "Playing" : "Paused"}</Text>
            <Text className={'text-2xl'}>{(currentlyPlaying?.progress_ms !== undefined) ? (Math.round(currentlyPlaying?.progress_ms / 1000)) : null}</Text>
            <Progress.Bar progress={(currentlyPlaying?.progress_ms !== undefined) ? (currentlyPlaying?.progress_ms / currentlyPlaying?.item?.duration_ms) : 0} width={200} color={'black'}/>
        </View>
    ) : (state == 'previous') ? (
        <View className={'h-full flex justify-center items-center gap-4'}>
            <Text className={'text-center text-4xl font-bold text-blue-500'}>Previously Played:</Text>
            <Text className={'text-center text-5xl font-bold'}>{previouslyPlayed?.track?.name}</Text>
            <Image style={{height: 300, width: 300}} source={{uri: previouslyPlayed?.track?.album.images[0].url}}/>
            <Text className={'text-2xl'}>Paused</Text>
        </View>
    ) : (
        <View className={'h-full flex justify-center items-center'}>
            <Text className={'text-center text-5xl font-bold'}>No music playing</Text>
        </View>
    );
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

type previouslyPlayedType = {
    track: {
        name: string,
        duration_ms: number,
        album: {
            images: {
                url: string,
            }[]
        }
    }
}