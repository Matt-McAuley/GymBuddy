import {Image, Text, TouchableOpacity, View} from "react-native";
import {useEffect, useState} from "react";

export default function Timer() {
    const startTime = 200;
    const [time, setTime] = useState(startTime);
    const [paused, setPaused] = useState(true);

    useEffect(() => {
        if (!paused) {
            const intervalId = setInterval(() => {
                setTime(prevTime => prevTime - 1);
            }, 1000); // Update every second

            return () => clearInterval(intervalId);
        }
    }, [paused]);


    return (
        <View className={'flex-row justify-between items-center h-40 w-full bg-gray-500 rounded-2xl pl-3 pr-3 border-black border-4'}>
            <Text className={"text-black-500 font-extrabold text-6xl border-4 border-black p-4 bg-yellow-50"}>
                {(String)(Math.floor(time / 3600)).padStart(2, "0")}:
                {(String)(Math.floor((time / 60) % 60)).padStart(2, "0")}:
                {(String)(Math.floor(time % 60)).padStart(2, "0")}
            </Text>
            <View className={"flex-col ml-2"}>
                <TouchableOpacity onPress={() => setPaused(!paused)}>
                    <Image className={"h-18 w-18"}
                           source={(paused) ?
                               require("@/assets/images/timer/play.png") :
                               require("@/assets/images/timer/pause.png")}/>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => {
                    setTime(startTime);
                    setPaused(true);
                }}>
                    <Image className={"h-18 w-18"}
                           source={require("@/assets/images/timer/restart.png")}/>
                </TouchableOpacity>
            </View>
        </View>
    );
}