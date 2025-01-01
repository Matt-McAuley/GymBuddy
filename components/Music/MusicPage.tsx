import MusicControl from "@/components/Music/MusicControl";
import {ScrollView, Text, Touchable, TouchableOpacity, View} from "react-native";
import Playlists from "@/components/Music/Playlists";
import {useMusicStore} from "@/store";
import {useEffect} from "react";
import Queue from "@/components/Music/Queue";
import AsyncStorage from "@react-native-async-storage/async-storage";


export default function MusicPage() {
    const { inQueue, active, setActive, accessToken, setAccessToken, setLoggedIn } = useMusicStore();

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

    const logout = async () => {
        fetch('https://api.spotify.com/v1/me/player/pause', {
            method: 'PUT',
            headers: {
                Authorization: 'Bearer ' + accessToken!,
            }
        }).catch(e => console.log(e));
        await AsyncStorage.removeItem('access_token');
        await AsyncStorage.removeItem('expiration');
        await AsyncStorage.removeItem('refresh_token');
        setAccessToken(null);
        setLoggedIn(false);
    }

    return (active) ?
        (!inQueue) ? (
        <ScrollView contentContainerStyle={{justifyContent: 'center', alignItems: 'center'}} className={"flex-col"}>
            <MusicControl />
            <Playlists />
            <TouchableOpacity onPress={logout} className={'p-5 bg-red-500 w-80 rounded-2xl mb-5'}>
                <Text className={'text-3xl font-bold color-white text-center'}>Logout</Text>
            </TouchableOpacity>
        </ScrollView>
    ) : (
            <Queue />
        )
            : (
        <View className={'h-full flex justify-center items-center p-5'}>
            <Text className={'text-center text-5xl font-bold'} style={{marginBottom: 50}}>No music playing</Text>
            <TouchableOpacity onPress={logout} className={'p-5 bg-red-500 w-80 rounded-2xl'}>
                <Text className={'text-3xl font-bold color-white text-center'}>Logout</Text>
            </TouchableOpacity>
        </View>
    );
}