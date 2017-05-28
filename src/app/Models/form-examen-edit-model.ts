import { DisciplineModel } from './discipline-model';
import { ExamenModel } from './examen-model';
import { StudentModel } from './student-model';
import { RateModel } from './rate-model';

export class FormEditItem {
    startTime: Date;
    endTime: Date;
    examen: ExamenModel;
    discipline: DisciplineModel;
    studentID: any;
    rates: RateModel[] = [];
    student: StudentModel;
}
