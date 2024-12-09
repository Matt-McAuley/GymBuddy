import {useMusicStore} from "@/store";
import {Image, Text, TouchableOpacity, View} from "react-native";
import {useEffect, useState} from "react";
import * as Progress from 'react-native-progress';
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function MusicControl() {
    const {accessToken} = useMusicStore();
    const [currentlyPlaying, setCurrentlyPlaying] = useState<currentlyPlayingType | null>(null);
    const [previouslyPlayed, setPreviouslyPlayed] = useState<previouslyPlayedType | null>(null);
    const [active, setActive] = useState(false);
    const [paused, setPaused] = useState(true);

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
                    console.log("Inactive");
                    setActive(false);
                    return null;
                }
                return response.json();
            })
                .then(data => {
                    if (data === null) return;
                    setActive(true);
                    setPaused(!data.is_playing);
                    setCurrentlyPlaying(data);
                })
                .catch(e => console.log(e));
        }, 1000);
    }, []);

    const playPause = () => {
        if (paused) {
            fetch('https://api.spotify.com/v1/me/player/play',
                {
                method: 'PUT',
                headers: {
                    Authorization: 'Bearer ' + accessToken!,
                }
            }).then(response => {
                setPaused(false);
                })
                .catch(e => console.log(e));
        }
        if (!paused) {
            fetch('https://api.spotify.com/v1/me/player/pause', {
                method: 'PUT',
                headers: {
                    Authorization: 'Bearer ' + accessToken!,
                }
            }).then(response => {
                    setPaused(true);
                })
                .catch(e => console.log(e));
        }
    }

    const nextSong = () => {
        fetch('https://api.spotify.com/v1/me/player/next', {
            method: 'POST',
            headers: {
                Authorization: 'Bearer ' + accessToken!,
            }
        }).then(response => {
                setPaused(false);
            })
            .catch(e => console.log(e));
    }

    const prevSong = () => {
        fetch('https://api.spotify.com/v1/me/player/previous', {
            method: 'POST',
            headers: {
                Authorization: 'Bearer ' + accessToken!,
            }
        }).then(response => {
                setPaused(false);
            })
            .catch(e => console.log(e));
    }

    const timeToString = (time: number) => {
        return (String)(Math.floor((time / 60) % 60)).padStart(2, "0") + ":" +
            (String)(Math.floor(time % 60)).padStart(2, "0");
    }

    return (active) ? (
        <View className={'flex justify-center items-center h-full gap-4 p-5'}>
            <Text className={'text-center text-4xl font-bold'}>{currentlyPlaying?.item?.name}</Text>
            <Image style={{height: 300, width: 300}} source={{uri: currentlyPlaying?.item?.album.images[0].url}}/>
            <View className={'flex-row justify-between items-center gap-4'}>
                <Text className={'text-2xl'}>{timeToString(Math.round(currentlyPlaying!.progress_ms / 1000))}</Text>
                <Progress.Bar progress={currentlyPlaying!.progress_ms / currentlyPlaying!.item!.duration_ms} width={200} height={9} color={'black'}/>
                <Text className={'text-2xl'}>{timeToString(Math.round(currentlyPlaying!.item!.duration_ms / 1000))}</Text>
            </View>
            <View className={'flex-row justify-between items-center w-80'}>
                <TouchableOpacity onPress={prevSong}>
                    <Image className={'h-18 w-18'} source={require('@/assets/images/music/previousSong.png')}/>
                </TouchableOpacity>
                <TouchableOpacity onPress={playPause}>
                    <Image className={'h-18 w-18'} source={(!paused) ? require('@/assets/images/music/pauseSong.png') : require('@/assets/images/music/playSong.png')}/>
                </TouchableOpacity>
                <TouchableOpacity onPress={nextSong}>
                    <Image className={'h-18 w-18'} source={require('@/assets/images/music/nextSong.png')}/>
                </TouchableOpacity>
            </View>
        </View>
    ) : (
        <View className={'h-full flex justify-center items-center p-5'}>
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
    },
    context: {
        uri: string,
    }
}