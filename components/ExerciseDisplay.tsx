import {useStore} from "@/store";
import PrimaryExercise from '@/components/exerciseDisplays/PrimaryExercise';
import AccessoryExercise from '@/components/exerciseDisplays/AccessoryExercise';
import SuperSet from '@/components/exerciseDisplays/SuperSet';

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