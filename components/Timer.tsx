import {Image, Text, TouchableOpacity, View} from "react-native";
import {useEffect, useState} from "react";

export default function Timer() {
    const startTime = 180;
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
        <View className={'flex-row justify-between items-center h-32 w-96 bg-blue-500 p-10 rounded-2xl'}>
            <Text className={"text-black-500 font-extrabold text-5xl"}>
                {(String)(Math.floor(time / 3600)).padStart(2, "0")}:
                {(String)(Math.floor((time / 60) % 60)).padStart(2, "0")}:
                {(String)(Math.floor(time % 60)).padStart(2, "0")}
            </Text>
            <View>
                <TouchableOpacity onPress={() => setPaused(!paused)}>
                    <Image className={"h-12 w-12"}
                           source={(paused) ?
                               require("@/assets/images/timer/play.png") :
                               require("@/assets/images/timer/pause.png")}/>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => {
                    setTime(startTime);
                    setPaused(true);
                }}>
                    <Image className={"h-12 w-12"}
                           source={require("@/assets/images/timer/restart.png")}/>
                </TouchableOpacity>
            </View>
        </View>
    );
}