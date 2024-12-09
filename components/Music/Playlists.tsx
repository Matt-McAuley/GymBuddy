import {View, Text, Image, ScrollView, TouchableOpacity} from "react-native";
import {useEffect, useState} from "react";
import {useMusicStore} from "@/store";


export default function Playlists() {
    const {accessToken} = useMusicStore();
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
            setPlaylists(data.items.filter((item : any) => item !== null).map((playlist: any) => {
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
        }).catch(e => console.log(e));
    }

    return (
        <View className={'flex-col justify-center items-center h-60'}>
            <Text className={'text-5xl font-bold'}>Playlists</Text>
            <ScrollView horizontal className={'h-30'} contentContainerStyle={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
                {playlists.map((playlist, index) => {
                    return (
                        <View key={playlist.name} className={'gap-5'}>
                            <TouchableOpacity onPress={() => startPlaying(playlist.uri)}>
                                <Image source={{uri: playlist.image}} style={{width: 150, height: 150, margin: 5}}/>
                            </TouchableOpacity>
                        </View>
                    )
                })}
            </ScrollView>
        </View>
    );
}

type playlistType = {
    name: string,
    id: string,
    image: string,
    uri: string
}