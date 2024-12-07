import {useMusicStore} from "@/store";
import {Image, Text, TouchableOpacity, View} from "react-native";
import {useEffect, useState} from "react";
import * as Progress from 'react-native-progress';
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function MusicControl() {
    const {accessToken} = useMusicStore();
    const [currentlyPlaying, setCurrentlyPlaying] = useState<currentlyPlayingType | null>(null);
    const [previouslyPlayed, setPreviouslyPlayed] = useState<previouslyPlayedType | null>(null);
    const [state, setState] = useState('none'); // none, previous, active
    const [paused, setPaused] = useState(true);
    const [deviceID, setDeviceID] = useState<number | null>(null);

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
                    if (previouslyPlayed === null) {
                        getRecentlyPlayed();
                    }
                    return null;
                }
                return response.json();
            })
                .then(data => {
                    if (data === null) return;
                    setState('active');
                    setPaused(!data.is_playing);
                    setCurrentlyPlaying(data);
                    setDeviceID(data.device.id);
                    AsyncStorage.setItem('device_id', data.device.id);
                })
                .catch(e => console.log(e));
        }, 1000);
    }, []);

    const getDeviceID = async () => {
        const deviceID = await AsyncStorage.getItem('device_id');
        if (deviceID !== null) {
            setDeviceID(parseInt(deviceID));
            return;
        }
    }

    useEffect(() => {
        getDeviceID();
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
            setState('previous')
            setPaused(true);
            setPreviouslyPlayed(data.items[0]);
        });
    }

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

    const transferPlayback = () => {
        fetch('https://api.spotify.com/v1/me/player/devices', {
            headers: {
                Authorization: 'Bearer ' + accessToken!,
            }
        }).then(response => {
            return response.json();
        }).then(data => {
            console.log('devices', data);
        }).catch(e => console.log(e));

        if (deviceID !== null) {
            console.log('id', deviceID);
            fetch(`https://api.spotify.com/v1/me/player/play?device_id=${deviceID}`,
                {
                method: 'PUT',
                headers: {
                    Authorization: 'Bearer ' + accessToken!,
                },
                body: JSON.stringify({
                    device_ids: [deviceID],
                    play: true,
                })
            }).then(async response => {
                const responseBody = await response.text();
                console.log(responseBody);
                console.log(response);
                setPaused(false);
            }).catch(e => console.log(e));
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

    return (state == 'active') ? (
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
    ) : (state == 'previous') ? (
        <View className={'h-full flex justify-center items-center gap-4 p-5'}>
            <Text className={'text-center text-4xl font-bold text-blue-500'}>Previously Played:</Text>
            <Text className={'text-center text-4xl font-bold'}>{previouslyPlayed?.track?.name}</Text>
            <Image style={{height: 300, width: 300}} source={{uri: previouslyPlayed?.track?.album.images[0].url}}/>
            <View className={'flex-row justify-between items-center w-80'}>
                <TouchableOpacity onPress={prevSong}>
                    <Image className={'h-18 w-18'} source={require('@/assets/images/music/previousSong.png')}/>
                </TouchableOpacity>
                <TouchableOpacity onPress={transferPlayback}>
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