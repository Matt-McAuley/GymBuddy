import {View, Text, Image, ScrollView, TouchableOpacity} from "react-native";
import {useEffect, useState} from "react";
import {useMusicStore} from "@/store";
import {VolumeManager} from "react-native-volume-manager";


export default function Playlists() {
    const {accessToken, setInQueue, setPaused, volume} = useMusicStore();
    const [playlists, setPlaylists] = useState<playlistType[]>([]);

    useEffect(() => {
        fetch('https://api.spotify.com/v1/me/playlists', {
            headers: {
                Authorization: 'Bearer ' + accessToken!,
            }
        }).then(response => {
            if (response.status === 429) {
                return null;
            }
            return response.json();
        }).then(data => {
            if (data === null) return;
            setPlaylists(data.items.reverse().filter((item : any) => item !== null).map((playlist: any) => {
                return {
                    name: playlist.name,
                    id: playlist.id,
                    image: playlist.images[0].url,
                    uri: playlist.uri
                }
            })
            )
        }).catch(e => console.log(e));
    }, []);

    const startPlaying = (playlistURI: string) => {
        fetch(`https://api.spotify.com/v1/me/player/play`, {
            method: 'PUT',
            headers: {
                Authorization: 'Bearer ' + accessToken!,
            },
            body: JSON.stringify({
                context_uri: playlistURI
            })
        }).then(_ => {
            setPaused(false);
            VolumeManager.setVolume(volume);
        })
            .catch(e => console.log(e));
    }

    return (
        <View className={'flex-col justify-center items-center'}>
            <View className={'flex-row w-full justify-center items-center relative mb-3'}>
                <Text className={'text-5xl font-bold text-center flex-1'}>Playlists</Text>
                <TouchableOpacity onPress={() => setInQueue(true)} className={'p-5 absolute right-0'}>
                    <Image source={require('@/assets/images/music/queueIcon.png')} style={{height: 50, width: 50}}/>
                </TouchableOpacity>
            </View>
            <View style={{height: 230}}>
                <ScrollView horizontal contentContainerStyle={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center', height: 200}}>
                    {playlists.map((playlist, index) => {
                        return (
                            <View key={playlist.name + index} className={'gap-5'}>
                                <TouchableOpacity onPress={() => startPlaying(playlist.uri)}>
                                    <Image source={{uri: playlist.image}} style={{width: 200, height: 200, margin: 5}}/>
                                </TouchableOpacity>
                            </View>
                        )
                    })}
                </ScrollView>
            </View>
        </View>
    );
}

type playlistType = {
    name: string,
    id: string,
    image: string,
    uri: string
}