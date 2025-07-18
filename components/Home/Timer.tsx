import {Image, Text, TouchableOpacity, View} from "react-native";
import {useEffect, useRef, useState} from "react";
import { useStore } from "@/store";
import { startLiveActivity, stopLiveActivity, pause, resume } from "@/modules/activity-controller";

export default function Timer() {
    const {isAccessoryExercise, isPrimaryExercise} = useStore();
    const exercise = useStore((state) => state.exercise());
    const [paused, setPaused] = useState(true);
    const restTime = (isAccessoryExercise(exercise)) ? exercise.rest : (isPrimaryExercise(exercise))
    ? exercise.rest : Math.max(exercise.exercise1.rest, exercise.exercise2.rest)
    const [pausedTime, setPausedTime] = useState(restTime);
    const [value, setValue] = useState(restTime);
    const [timeOfDay, setTimeOfDay] = useState(Date.now());

    useEffect(() => {
        const restTime = (isAccessoryExercise(exercise)) ? exercise.rest : (isPrimaryExercise(exercise))
            ? exercise.rest : Math.max(exercise.exercise1.rest, exercise.exercise2.rest);
        setPaused(true);
        setValue(restTime);
        setPausedTime(restTime);
        setTimeOfDay(Date.now());
    }, [exercise]);

    useEffect(() => {
        const interval = setInterval(() => {
            if (paused) {
                return;
            }
            const elapsed = Math.floor((Date.now() - timeOfDay) / 1000);
            const newValue = Math.max(0, pausedTime - elapsed);
            setValue(newValue);

            if (newValue <= 0) {
                stopLiveActivity();
                setPaused(true);
            }
        }, 500);
        return () => clearInterval(interval);
    }, [paused, pausedTime, timeOfDay]);

    return (
        <View className={'flex-row justify-between items-center h-40 w-full bg-gray-500 rounded-2xl pl-3 pr-3 border-black border-4'}>
            <View className={"flex justify-center items-center border-4 border-black p-2 bg-amber-50 h-28"}>
                <Text className={"text-black-500 font-extrabold text-6xl"}>
                    {(String)(Math.floor(value / 3600)).padStart(2, "0")}:
                    {(String)(Math.floor((value / 60) % 60)).padStart(2, "0")}:
                    {(String)(Math.floor(value % 60)).padStart(2, "0")}
                </Text>
            </View>
            <View className={"flex-col ml-2"}>
                <TouchableOpacity onPress={() => {
                    if (paused) {
                        if (value == restTime)
                            startLiveActivity(restTime, Date.now());
                        else
                            resume();
                        setTimeOfDay(Date.now());
                    } else {
                        setPausedTime(value);
                        pause(Date.now());
                    }
                    setPaused(!paused);
                }}>
                    <Image className={"h-18 w-18"}
                           source={(paused) ?
                               require("@/assets/images/timer/play.png") :
                               require("@/assets/images/timer/pause.png")}/>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => {
                    setValue(restTime);
                    setPausedTime(restTime);
                    setTimeOfDay(Date.now());
                    setPaused(true);
                    stopLiveActivity();
                }}>
                    <Image className={"h-18 w-18"}
                           source={require("@/assets/images/timer/restart.png")}/>
                </TouchableOpacity>
            </View>
        </View>
    );
}