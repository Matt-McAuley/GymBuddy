import { View, Text } from "react-native";
import Timer from "@/components/Timer";
import Counter from "@/components/Counter";
import ExerciseDisplay from "@/components/ExerciseDisplay";
import programInfoType from "@/types/programInfoType";
import {useState} from "react";

export default function Index() {
    const [day, setDay] = useState("Push");
    const [color, setColor] = useState("red");

    const nextExerciseHandler = () => {
        console.log('Next Exercise');
    }

    const prevExerciseHandler = () => {
        console.log('Previous Exercise');
    }

    const programInfo : programInfoType = {
        currentExercise: 'Bench',
        currentWeight: 185,
        nextExercise: 'Ham Curl',
        nextWeight: 45,
        prevExercise: 'Squat',
        prevWeight: 225,
        scheme: '5x5',
        nextExerciseHandler: nextExerciseHandler,
        prevExerciseHandler: prevExerciseHandler,
    }
    
  return (
    <View className={'flex-1 flex-col justify-start items-center p-3 gap-4'}>
        <Text className={`text-7xl font-bold color-${color}-500`}>{day}</Text>
        <Timer startTime={60}/>
        <Counter sets={5} reps={[5, 3, 1, 3, 5]}/>
        <ExerciseDisplay programInfo={programInfo}/>
    </View>
  );
}
