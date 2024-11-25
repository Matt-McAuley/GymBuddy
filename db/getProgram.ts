import programType from "@/types/programType";

export default async function getProgram(db) {
    const res: programType = {
        name: '',
        days: []
    }

    const currentProgram = await db.getSync(`SELECT program FROM current_program`);

    const program = await db.getFirstSync(`SELECT * FROM programs WHERE id = ${currentProgram.program}`);
    res.name = program.name;
    for (const dayOfWeek of ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']) {
        let day = await db.getFirstSync(`SELECT * FROM days WHERE id = ${program[dayOfWeek]}`);
    }

    return program;
  }