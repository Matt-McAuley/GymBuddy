import {Image, Text, TouchableOpacity, View, Vibration} from "react-native";
import {useEffect, useState} from "react";
import { useStore } from "@/store";

export default function Timer() {
    const {isAccessoryExercise, isPrimaryExercise, retrievedTime, setRetrievedTime, retrievedPaused,
        setRetrievedPaused, retrievedYet, time, setTime, paused, setPaused, currentExercise, currentDay } = useStore();
    const exercise = useStore((state) => state.exercise());
    const [startTime, setStartTime] = useState((isAccessoryExercise(exercise)) ? exercise.rest : (isPrimaryExercise(exercise))
        ? exercise.rest : Math.max(exercise.exercise1.rest, exercise.exercise2.rest));

    const timerEnd = () => {
        fetch(`https://app.nativenotify.com/api/notification`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                appId: 30437,
                appToken: "7W4A9Or8CcpMusVIoFFmCx",
                title: "Timer finished",
                dateSent: Date.now().toString(),
            }),
        });
        setPaused(true);
    }

    useEffect(() => {
        setPaused(true);
        setStartTime(isAccessoryExercise(exercise) ? exercise.rest : (isPrimaryExercise(exercise))
            ? exercise.rest : Math.max(exercise.exercise1.rest, exercise.exercise2.rest));
        setTime(isAccessoryExercise(exercise) ? exercise.rest : (isPrimaryExercise(exercise))
            ? exercise.rest : Math.max(exercise.exercise1.rest, exercise.exercise2.rest));
    }, [exercise]);

    useEffect(() => {
        if (retrievedYet && retrievedTime !== null && retrievedPaused !== null) {
            setPaused(retrievedPaused);
            setTime(retrievedTime);
            setRetrievedTime(null);
            setRetrievedPaused(null);
        }
    }, [retrievedYet]);

    useEffect(() => {
        if (!paused) {
            const interval = setInterval(() => {
                if (time === 0) {
                    timerEnd();
                    return;
                }
                setTime(time - 1);
            }, 850);

            return () => clearInterval(interval);
        }
    }, [paused, time]);

    return (
        <View className={'flex-row justify-between items-center h-40 w-full bg-gray-500 rounded-2xl pl-3 pr-3 border-black border-4'}>
            <View className={"flex justify-center items-center border-4 border-black p-2 bg-amber-50 h-28"}>
                <Text className={"text-black-500 font-extrabold text-6xl"}>
                    {(String)(Math.floor(time / 3600)).padStart(2, "0")}:
                    {(String)(Math.floor((time / 60) % 60)).padStart(2, "0")}:
                    {(String)(Math.floor(time % 60)).padStart(2, "0")}
                </Text>
            </View>
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