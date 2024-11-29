import {Image, Text, TouchableOpacity, View, Vibration, Platform} from "react-native";
import {useEffect, useState} from "react";
import BackgroundTimer from 'react-native-background-timer';
import { useStore } from "@/store";

export default function Timer() {
    const {isAccessoryExercise, isPrimaryExercise, isSuperSet } = useStore();
    const exercise = useStore((state) => state.exercise());
    const [startTime, setStartTime] = useState((isAccessoryExercise(exercise)) ? exercise.rest : (isPrimaryExercise(exercise))
        ? exercise.rest : Math.max(exercise.exercise1.rest, exercise.exercise2.rest));
    const [time, setTime] = useState(startTime);
    const [paused, setPaused] = useState(true);

    const timerEnd = () => {
        Vibration.vibrate([700, 50, 700, 50, 700]);
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
        if (!paused) {
            const intervalId = BackgroundTimer.setInterval(() => {
                setTime(prevTime => {
                    if (prevTime == 0) {
                        timerEnd();
                        return startTime;
                    }
                    else
                        return prevTime - 1;
                });
            }, 1000); // Update every second

            return () => BackgroundTimer.clearInterval(intervalId);
        }
    }, [paused]);


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