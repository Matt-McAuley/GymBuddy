import {useStore} from "@/store";
import PrimaryExercise from '@/components/Home/exerciseDisplays/PrimaryExercise';
import AccessoryExercise from '@/components/Home/exerciseDisplays/AccessoryExercise';
import SuperSet from '@/components/Home/exerciseDisplays/SuperSet';

export default function ExerciseDisplay() {
    const {isAccessoryExercise, isPrimaryExercise, isSuperSet} = useStore();
    const exercise = useStore((state) => state.exercise());

    return (isPrimaryExercise(exercise)) ? (
        <PrimaryExercise />

    ) : (isAccessoryExercise(exercise)) ? (
        <AccessoryExercise />

    ) : (isSuperSet(exercise)) ? (
        <SuperSet />

    ) : null;
}