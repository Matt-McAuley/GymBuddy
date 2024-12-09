import {ScrollView, Text, TouchableOpacity, View} from "react-native";
import {useMusicStore} from "@/store";
import {useEffect, useState} from "react";

export default function Queue() {
    const {setInQueue, accessToken} = useMusicStore();
    const [queue, setQueue] = useState<queueType[]>([]);

    const fetchQueue = () => {
            fetch('https://api.spotify.com/v1/me/player/queue', {
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
            setQueue(data.queue.filter((item : any) => item !== null).map((queueItem: any) => {
                return {
                    name: queueItem.name,
                    artist: queueItem.artists[0].name,
                    uri: queueItem.uri
                }
            })
            )
        }).catch(e => console.log(e)); }

    useEffect(() => {
        fetchQueue();
        const intervalId = setInterval(() => {
            fetchQueue();
        }, 1000);
        return () => clearInterval(intervalId);
    }, []);

    const skipForward = (numSongs: number) => {
        for (let i = 0; i < numSongs; i++) {
            fetch('https://api.spotify.com/v1/me/player/next', {
                method: 'POST',
                headers: {
                    Authorization: 'Bearer ' + accessToken!,
                }
            }).catch(e => console.log(e));
        }
    }

    return (
    <ScrollView contentContainerStyle={{justifyContent: 'center', alignItems: 'center', display: 'flex', padding: 10, gap: 10}}>
        <TouchableOpacity onPress={() => setInQueue(false)} className={'self-end'}>
            <Text className={'p-3 text-center text-4xl font-bold bg-red-500 color-white'}>X</Text>
        </TouchableOpacity>
        <Text className={'text-center text-5xl font-bold'}>Queue</Text>
        {
            queue.map((queueItem, index) => {
                return (
                    <TouchableOpacity key={index} className={'flex-col gap-5 border-4 p-5 rounded-2xl w-full justify-center items-center'}
                    onPress={() => skipForward(index + 1)}>
                        <View>
                            <Text className={'text-3xl'}>{queueItem.name.split('(')[0]}</Text>
                            <Text className={'text-1xl'}>[{queueItem.artist}]</Text>
                        </View>
                    </TouchableOpacity>
                )
            })
        }
    </ScrollView>
    )
}

type queueType = {
    name: string,
    artist: string,
    uri: string
}