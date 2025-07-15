import React from "react";
import { Button, SafeAreaView, Text, View } from "react-native";
import { startLiveActivity, stopLiveActivity, pause, resume } from "@/modules/activity-controller";

const useTimer = () => {
  const [elapsedTimeInMs, setElapsedTimeInMs] = React.useState(0);
  const [isRunning, setIsRunning] = React.useState(false);
  const startTime = React.useRef<number | null>(null);
  const pausedTime = React.useRef<number>(0); // Total paused time
  const intervalId = React.useRef<NodeJS.Timeout | null>(null);

  const elapsedTimeInSeconds = Math.floor(elapsedTimeInMs / 1000);
  const secondUnits = elapsedTimeInSeconds % 10;
  const secondTens = Math.floor(elapsedTimeInSeconds / 10) % 6;
  const minutes = Math.floor(elapsedTimeInSeconds / 60);

  const value = `${minutes}:${secondTens}${secondUnits}`;

  function play() {
    if (intervalId.current) {
      return; // Already running
    }

    const now = Date.now();
    
    if (!startTime.current) {
      // First time starting
      startTime.current = now;
      startLiveActivity(now);
    } else {
      // Resuming from pause
      const pauseDuration = now - (startTime.current + elapsedTimeInMs);
      pausedTime.current += pauseDuration;
      resume();
    }

    setIsRunning(true);
    
    intervalId.current = setInterval(() => {
      setElapsedTimeInMs(Date.now() - startTime.current! - pausedTime.current);
    }, 1000);
  }

  function pauseTimer() {
    if (!intervalId.current) {
      return; // Not running
    }

    removeInterval();
    setIsRunning(false);
    pause(Date.now());
  }

  function reset() {
    removeInterval();
    startTime.current = null;
    pausedTime.current = 0;
    setElapsedTimeInMs(0);
    setIsRunning(false);
    stopLiveActivity();
  }

  function removeInterval() {
    if (intervalId.current) {
      clearInterval(intervalId.current);
      intervalId.current = null;
    }
  }

  return {
    play,
    pause: pauseTimer,
    reset,
    value,
    isRunning,
  };
};

function Timer(): React.JSX.Element {
  const { value, reset, play, pause, isRunning } = useTimer();
  
  return (
    <SafeAreaView
      style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
    >
      <View style={{ paddingVertical: 32 }}>
        <Text style={{ fontSize: 80, fontVariant: ["tabular-nums"] }}>
          {value}
        </Text>
      </View>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          paddingHorizontal: 48,
        }}
      >
        <View style={{ marginRight: 32 }}>
          {isRunning ? (
            <Button title="Pause" onPress={pause} />
          ) : (
            <Button title="Start" onPress={play} />
          )}
        </View>
        <Button title="Reset" onPress={reset} />
      </View>
    </SafeAreaView>
  );
}

export default Timer;