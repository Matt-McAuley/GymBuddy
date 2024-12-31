import {useMusicStore} from "@/store";
import {Image, Text, TouchableOpacity, View} from "react-native";
import {useEffect, useRef, useState} from "react";
import Slider from "@react-native-community/slider";
import { VolumeManager } from "react-native-volume-manager";
import BackgroundService from 'react-native-background-actions';

export default function MusicControl() {
    const {accessToken, setActive} = useMusicStore();
    const [currentlyPlaying, setCurrentlyPlaying] = useState<currentlyPlayingType | null>(null);
    const currentlyPlayingRef = useRef(currentlyPlaying);
    const [paused, setPaused] = useState(false);
    const pausedRef = useRef(paused);
    const [liked, setLiked] = useState(false);
    const [volume, setVolume] = useState(1);

    const backgroundPauseLoop = async () => {
        await new Promise( async (resolve) => {
            while (BackgroundService.isRunning()) {
                if (pausedRef.current) {
                    setPosition(currentlyPlayingRef.current!.progress_ms-1000);
                }
                await new Promise((resolve) => setTimeout(resolve, 1000));
            }
        });
    }

    useEffect(() => {
        BackgroundService.start(backgroundPauseLoop, {
            taskName: 'Music Control',
            taskTitle: 'Music Control',
            taskDesc: 'Music Control',
            taskIcon: {
                name: '',
                type: '',
            }});
        updateCurrent();
        const intervalId = setInterval(() => {
            updateCurrent();

        }, 1000);
        return () => {
            clearInterval(intervalId);
            BackgroundService.stop();
        }
    }, []);

    const updateCurrent = () => {
        fetch('https://api.spotify.com/v1/me/player', {
            headers: {
                Authorization: 'Bearer ' + accessToken!,
            }
        }).then(response => {
            if (response.status === 429) {
                console.log("Rate limited");
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
                setCurrentlyPlaying(data);
                checkIfLiked();
            })
            .catch(e => console.log(e));
    }

    useEffect(() => {
        pausedRef.current = paused;
    }, [paused]);

    useEffect(() => {
        currentlyPlayingRef.current = currentlyPlaying;
    }, [currentlyPlaying]);

    const quickPoll = () => {
        fetch('https://api.spotify.com/v1/me/player/play',
            {
                method: 'PUT',
                headers: {
                    Authorization: 'Bearer ' + accessToken!,
                }
            }).then(_ => {
            fetch('https://api.spotify.com/v1/me/player/pause',
                {
                    method: 'PUT',
                    headers: {
                        Authorization: 'Bearer ' + accessToken!,
                    }
                }).then().catch(e => console.log(e));
        }).catch(e => console.log(e));
    }

    const checkIfLiked = () => {
        fetch('https://api.spotify.com/v1/me/tracks', {
            headers: {
                Authorization: 'Bearer ' + accessToken!,
            }
        }).then(response => response.json())
            .then(data => {
                if (data.items.some((item: { track: { id: string; }; }) => item.track.id === currentlyPlayingRef.current?.item?.id)) {
                    setLiked(true);
                }
                else setLiked(false);
            }).catch(e => console.log(e));
    }

    const fakePause = () => {
        VolumeManager.getVolume().then(vol => {
            setVolume(vol.volume);
        });
        setPaused(true);
        VolumeManager.setVolume(0.0);
    }

    const fakePlay = () => {
        setPaused(false);
        VolumeManager.setVolume(volume);
    }

    const playPause = () => {
        if (paused) {
            fetch('https://api.spotify.com/v1/me/player/play',
                {
                method: 'PUT',
                headers: {
                    Authorization: 'Bearer ' + accessToken!,
                }
            }).then(_ => {
                setPaused(false);
                updateCurrent();
                })
                .catch(e => console.log(e));
        }
        if (!paused) {
            fetch('https://api.spotify.com/v1/me/player/pause', {
                method: 'PUT',
                headers: {
                    Authorization: 'Bearer ' + accessToken!,
                }
            }).then(_ => {
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
        }).then(_ => {
                setPaused(false);
                updateCurrent();
            })
            .catch(e => console.log(e));
        fakePlay();
    }

    const prevSong = () => {
        fetch('https://api.spotify.com/v1/me/player/previous', {
            method: 'POST',
            headers: {
                Authorization: 'Bearer ' + accessToken!,
            }
        }).then(_ => {
                setPaused(false);
                updateCurrent();
            })
            .catch(e => console.log(e));
        fakePlay();
    }

    const shuffle = () => {
        const shuffle = (currentlyPlayingRef.current?.shuffle_state) ? 'false' : 'true';
        fetch('https://api.spotify.com/v1/me/player/shuffle?' + new URLSearchParams({
            state: shuffle,
        }), {
            method: 'PUT',
            headers: {
                Authorization: 'Bearer ' + accessToken!,
            }
        }).catch(e => console.log(e));
    }

    const like = () => {
        const songId = currentlyPlaying?.item?.id;
        fetch('https://api.spotify.com/v1/me/tracks', {
            method: 'PUT',
            headers: {
                Authorization: 'Bearer ' + accessToken!,
            },
            body: JSON.stringify({
                ids: [songId],
            })
        }).then(_ => updateCurrent())
            .catch(e => console.log(e));
    }

    const unlike = () => {
        const songId = currentlyPlaying?.item?.id;
        fetch('https://api.spotify.com/v1/me/tracks', {
            method: 'DELETE',
            headers: {
                Authorization: 'Bearer ' + accessToken!,
            },
            body: JSON.stringify({
                ids: [songId],
            })
        }).then(_ => updateCurrent())
            .catch(e => console.log(e));
    }

    const setPosition = (position: number) => {
        if (currentlyPlaying !== null)
            setCurrentlyPlaying({...currentlyPlaying, progress_ms: Math.round(position)});
        fetch('https://api.spotify.com/v1/me/player/seek?' + new URLSearchParams({
            position_ms: Math.round(position).toString(),
        }), {
            method: 'PUT',
            headers: {
                Authorization: 'Bearer ' + accessToken!,
            }
        }).catch(e => console.log(e));
        if (currentlyPlaying !== null)
            setCurrentlyPlaying({...currentlyPlaying, progress_ms: Math.round(position)});
    }

    const timeToString = (time: number) => {
        return (String)(Math.floor((time / 60) % 60)).padStart(2, "0") + ":" +
            (String)(Math.floor(time % 60)).padStart(2, "0");
    }

    return (currentlyPlaying !== null) ? (
        <View className={'flex justify-center items-center gap-4 p-7'}>
            <Text className={'text-center text-5xl font-bold'}>{currentlyPlaying?.item?.name.split('(')[0]}</Text>
            <Text className={'text-center text-xl font-bold'}>[{currentlyPlaying?.item?.artists.map(artist => artist.name).join(', ')}]</Text>
            <Image style={{height: 300, width: 300}} source={{uri: currentlyPlaying?.item?.album.images[0].url}}/>
            <View className={'flex-row justify-between items-center w-full gap-4'}>
                <Text className={'text-2xl'}>{timeToString(Math.round(currentlyPlaying!.progress_ms / 1000))}</Text>
                <Slider style={{width: 200, height: 80}} value={currentlyPlaying!.progress_ms} minimumValue={0} maximumValue={currentlyPlaying!.item!.duration_ms}
                        onSlidingComplete={(pos) => setPosition(pos)} tapToSeek={true} minimumTrackTintColor={'black'} />
                <Text className={'text-2xl'}>{timeToString(Math.round(currentlyPlaying!.item!.duration_ms / 1000))}</Text>
            </View>
            <View className={'flex-row justify-between items-center w-full'}>
                <TouchableOpacity onPress={shuffle}>
                    <Image className={'h-13 w-13'} source={require('@/assets/images/music/shuffleIcon.png')} style={{tintColor: (currentlyPlaying!.shuffle_state) ? 'green' : 'black'}}/>
                </TouchableOpacity><TouchableOpacity onPress={prevSong}>
                    <Image className={'h-18 w-18'} source={require('@/assets/images/music/previousSong.png')}/>
                </TouchableOpacity>
                <TouchableOpacity onPress={(paused) ? fakePlay : fakePause}>
                    <Image className={'h-18 w-18'} source={(!paused) ? require('@/assets/images/music/pauseSong.png') : require('@/assets/images/music/playSong.png')}/>
                </TouchableOpacity>
                <TouchableOpacity onPress={nextSong}>
                    <Image className={'h-18 w-18'} source={require('@/assets/images/music/nextSong.png')} />
                </TouchableOpacity>
                <TouchableOpacity onPress={(liked) ? unlike : like}>
                    <Image className={'h-13 w-13'} source={(liked) ? require('@/assets/images/music/likedIcon.png') : require('@/assets/images/music/unlikedIcon.png')}
                    style={{tintColor: (liked) ? 'green' : 'black'}}/>
                </TouchableOpacity></View>
        </View>
    ) : null;
}

type currentlyPlayingType = {
    device: {
        id: string,
        type: string,
        volume_percent: number,
        supports_volume: boolean,
    },
    shuffle_state: boolean,
    is_playing: boolean,
    progress_ms: number,
    item: {
        name: string,
        id: string,
        duration_ms: number,
        album: {
            images: {
                url: string,
            }[]
        },
        artists: [
            {
                name: string,
            }
        ]
    },
}