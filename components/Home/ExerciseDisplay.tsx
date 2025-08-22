import {useStore} from "@/store";
import Exercise from '@/components/Home/exerciseDisplays/Exercise';
import SuperSet from '@/components/Home/exerciseDisplays/SuperSet';

export default function ExerciseDisplay(props: ExerciseDisplayProps) {
    const {isSuperSet, program} = useStore();
    const {currentExercise, currentDay} = props;
    const exercise = program!.days[currentDay].exercises[currentExercise];
    const prevExercise = (currentExercise > 0) ? program!.days[currentDay].exercises[currentExercise - 1] : null;
    const nextExercise = (currentExercise < program!.days[currentDay].exercises.length-1) ? program!.days[currentDay].exercises[currentExercise + 1] : null;

    const exerciseComponent =
        (!isSuperSet(exercise)) ? <Exercise exercise={exercise} nextExercise={nextExercise} prevExercise={prevExercise}/>
            : <SuperSet exercise={exercise} nextExercise={nextExercise} prevExercise={prevExercise}/>;

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