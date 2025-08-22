import {Image, Text, TouchableOpacity, View} from "react-native";
import {useEffect, useState} from "react";
import { useStore } from "@/store";
import { startLiveActivity, stopLiveActivity, pause, resume, addTimerListener, startListening } from "@/modules/activity-controller";

export default function Timer() {
    const {isAccessoryExercise, isPrimaryExercise} = useStore();
    const exercise = useStore((state) => state.exercise());
    const exerciseName = isAccessoryExercise(exercise) ? exercise.name : (isPrimaryExercise(exercise))
        ? exercise.name : exercise.exercise1.name.split(' ').map((s) => s[0]).join('') + ' & ' + exercise.exercise2.name.split(' ').map((s) => s[0]).join('');
    const [startedAt, setStartedAt] = useState<Date | null>(null);
    const [startTime, setStartTime] = useState(isAccessoryExercise(exercise) ? exercise.rest : (isPrimaryExercise(exercise))
    ? exercise.rest : Math.max(exercise.exercise1.rest, exercise.exercise2.rest));
    const [pausedAt, setPausedAt] = useState<Date | null>(null);
    const [displayTime, setDisplayTime] = useState(0);

    useEffect(() => {
        const newStartTime = isAccessoryExercise(exercise) ? exercise.rest : (isPrimaryExercise(exercise))
            ? exercise.rest : Math.max(exercise.exercise1.rest, exercise.exercise2.rest);
        setStartTime(newStartTime);
        setStartedAt(null);
        setPausedAt(null);
        setDisplayTime(newStartTime);
        stopLiveActivity();
    }, [exercise]);

    useEffect(() => {
        const interval = setInterval(() => {
            if (startedAt && !pausedAt) {
                // Timer is running
                const elapsedSeconds = (Date.now() - startedAt.getTime()) / 1000;
                const remaining = Math.max(0, startTime - elapsedSeconds);
                setDisplayTime(remaining);
            } else if (startedAt && pausedAt) {
                // Timer is paused
                const elapsedSeconds = (pausedAt.getTime() - startedAt.getTime()) / 1000;
                const remaining = Math.max(0, startTime - elapsedSeconds);
                setDisplayTime(remaining);
            } else {
                // Timer not started
                setDisplayTime(startTime);
            }
        }, 100);

        return () => clearInterval(interval);
    }, [startedAt, pausedAt, startTime]);

    useEffect(() => {
        startListening();
        const listener = (event: {action: string, timestamp: number}) => {
            const {action, timestamp} = event;
            if (action === "pause") {
                setPausedAt(new Date(timestamp));
            } else if (action === "resume") {
                if (startedAt && pausedAt) {
                    const elapsedSincePause = (timestamp - pausedAt.getTime()) / 1000;
                    const newStartedAt = new Date(startedAt.getTime() + elapsedSincePause * 1000);
                    setStartedAt(newStartedAt);
                    setPausedAt(null);
                }
            } else if (action === "reset") {
                setStartedAt(null);
                setPausedAt(null);
                setDisplayTime(startTime);
            }
        };

        const timerListener = addTimerListener(listener);

        return () => {timerListener.remove();};
    }, [startedAt, pausedAt, startTime]);

    const formatTime = (seconds: number): string => {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = Math.floor(seconds % 60);
        
        return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
    };

    const handlePlayPause = () => {
        const now = new Date();
        
        if (!startedAt) {
            // First time starting
            setStartedAt(now);  
            setPausedAt(null);
            startLiveActivity(startTime, now.getTime() / 1000, exerciseName);
        } else if (pausedAt) {
            // Resuming from pause
            const elapsedSincePause = (now.getTime() - pausedAt.getTime()) / 1000;
            const newStartedAt = new Date(startedAt.getTime() + elapsedSincePause * 1000);
            setStartedAt(newStartedAt);
            setPausedAt(null);
            resume(now.getTime() / 1000);
        } else {
            // Pausing
            setPausedAt(now);
            pause(now.getTime() / 1000);
        }
    };

    const handleReset = () => {
        setStartedAt(null);
        setPausedAt(null);
        setDisplayTime(startTime);
        stopLiveActivity();
    };

    const isRunning = startedAt && !pausedAt;

    return (
        <View className={'flex-row justify-between items-center h-40 w-full bg-gray-500 rounded-2xl pl-3 pr-3 border-black border-4'}>
            <View className={"flex justify-center items-center border-4 border-black p-2 bg-amber-50 h-28"}>
                <Text className={"text-black-500 font-extrabold text-6xl"}>
                    {formatTime(displayTime)}
                </Text>
            </View>
            <View className={"flex-col ml-2"}>
                <TouchableOpacity onPress={handlePlayPause}>
                    <Image className={"h-18 w-18"}
                           source={isRunning ?
                               require("@/assets/images/timer/pause.png") :
                               require("@/assets/images/timer/play.png")}/>
                </TouchableOpacity>
                <TouchableOpacity onPress={handleReset}>
                    <Image className={"h-18 w-18"}
                           source={require("@/assets/images/timer/restart.png")}/>
                </TouchableOpacity>
            </View>
        </View>
    );
}