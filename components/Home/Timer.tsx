import React, { useEffect, useState } from "react";
import { Image, Text, TouchableOpacity, View, Vibration } from "react-native";
import BackgroundTimer from "react-native-background-timer";
import { useStore } from "@/store";
import {
    startLiveActivity,
    updateLiveActivity,
    stopLiveActivity,
    isLiveActivityRunning,
} from "@/modules/activity-controller"; // adjust path as needed

export default function Timer() {
    const {
        isAccessoryExercise,
        isPrimaryExercise,
        time,
        setTime,
        paused,
        setPaused,
        currentExercise,
    } = useStore();

    // determine your startTime however you like...
    const [startTime] = useState(
        isAccessoryExercise(currentExercise)
            ? currentExercise.rest
            : isPrimaryExercise(currentExercise)
                ? currentExercise.rest
                : Math.max(
                    currentExercise.exercise1.rest,
                    currentExercise.exercise2.rest
                )
    );

    // 1) Start press
    const onStart = async () => {
        await startLiveActivity({ exerciseName: currentExercise.name });
        setPaused(false);
    };

    // 2) Pause/Resume toggle in-app
    const togglePause = () => {
        setPaused(p => !p);
    };

    // 3) Reset/X press
    const onReset = async () => {
        if (isLiveActivityRunning()) {
            await stopLiveActivity();
        }
        setPaused(true);
        setTime(startTime);
    };

    // 4) Every time time or paused changes, push update to Live Activity
    useEffect(() => {
        if (isLiveActivityRunning()) {
            updateLiveActivity({
                remainingTime: time,
                isPaused: paused,
            });
        }
    }, [time, paused]);

    // 5) your existing countdown logic…
    useEffect(() => {
        if (!paused && time > 0) {
            const id = BackgroundTimer.setInterval(() => {
                setTime(t => {
                    if (t <= 1) {
                        Vibration.vibrate([700, 50, 700, 50, 700]);
                        setPaused(true);
                        return 0;
                    }
                    return t - 1;
                });
            }, 1000);
            return () => BackgroundTimer.clearInterval(id);
        }
    }, [paused]);

    return (
        <View>
            <Text>{/* display time in mm:ss or h:mm:ss */}</Text>
            {/* replace your existing buttons to hook up onStart, togglePause, onReset */}
            <TouchableOpacity onPress={onStart}>
                <Image source={require("@/assets/images/timer/start.png")} />
            </TouchableOpacity>
            <TouchableOpacity onPress={togglePause}>
                <Image
                    source={
                        paused
                            ? require("@/assets/images/timer/play.png")
                            : require("@/assets/images/timer/pause.png")
                    }
                />
            </TouchableOpacity>
            <TouchableOpacity onPress={onReset}>
                <Image source={require("@/assets/images/timer/restart.png")} />
            </TouchableOpacity>
        </View>
    );
}
