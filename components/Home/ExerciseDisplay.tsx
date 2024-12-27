import {useStore} from "@/store";
import PrimaryExercise from '@/components/Home/exerciseDisplays/PrimaryExercise';
import AccessoryExercise from '@/components/Home/exerciseDisplays/AccessoryExercise';
import SuperSet from '@/components/Home/exerciseDisplays/SuperSet';

export default function ExerciseDisplay(props: ExerciseDisplayProps) {
    const {isAccessoryExercise, isPrimaryExercise, isSuperSet, program} = useStore();
    const {currentExercise, currentDay} = props;
    const exercise = program!.days[currentDay].exercises[currentExercise];
    const prevExercise = (currentExercise > 0) ? program!.days[currentDay].exercises[currentExercise - 1] : null;
    const nextExercise = (currentExercise < program!.days[currentDay].exercises.length-1) ? program!.days[currentDay].exercises[currentExercise + 1] : null;

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

type ExerciseDisplayProps = {
    currentExercise: number,
    currentDay: number
}