import {useStore} from "@/store";
import PrimaryExercise from '@/components/Home/exerciseDisplays/PrimaryExercise';
import AccessoryExercise from '@/components/Home/exerciseDisplays/AccessoryExercise';
import SuperSet from '@/components/Home/exerciseDisplays/SuperSet';

export default function ExerciseDisplay() {
    const {isAccessoryExercise, isPrimaryExercise, isSuperSet} = useStore();
    const exercise = useStore((state) => state.exercise());
    const prevExercise = useStore((state) => state.prevExercise());
    const nextExercise = useStore((state) => state.nextExercise());

    const exerciseComponent =
        (isPrimaryExercise(exercise)) ? <PrimaryExercise exercise={exercise} nextExercise={nextExercise} prevExercise={prevExercise}/>
        : (isAccessoryExercise(exercise)) ? <AccessoryExercise exercise={exercise} nextExercise={nextExercise} prevExercise={prevExercise}/>
            : (isSuperSet(exercise)) ? <SuperSet exercise={exercise} nextExercise={nextExercise} prevExercise={prevExercise}/> : null;

    return (
        <>
            {exerciseComponent}
        </>
    )
}