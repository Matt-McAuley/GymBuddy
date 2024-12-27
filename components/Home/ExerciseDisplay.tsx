import {useStore} from "@/store";
import PrimaryExercise from '@/components/Home/exerciseDisplays/PrimaryExercise';
import AccessoryExercise from '@/components/Home/exerciseDisplays/AccessoryExercise';
import SuperSet from '@/components/Home/exerciseDisplays/SuperSet';
import {useEffect} from "react";
import {Animated, Easing, useAnimatedValue} from "react-native";

export default function ExerciseDisplay() {
    const {isAccessoryExercise, isPrimaryExercise, isSuperSet} = useStore();
    const exercise = useStore((state) => state.exercise());

    const slideAnim = useAnimatedValue(1000);
    useEffect(() => {
        slideAnim.setValue(1000);
        Animated.timing(slideAnim, {
            toValue: 0,
            duration: 500,
            easing: Easing.ease,
            useNativeDriver: true,
        }).start();
    }, [exercise]);

    const exerciseComponent = (isPrimaryExercise(exercise)) ? <PrimaryExercise />
        : (isAccessoryExercise(exercise)) ? <AccessoryExercise />
            : (isSuperSet(exercise)) ? <SuperSet /> : null;

    return (
        // <Animated.View style={{transform: [{ translateX: slideAnim }]}}>
        <>
            {exerciseComponent}
        </>
        // </Animated.View>
    )
}