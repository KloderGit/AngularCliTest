import { ExamenModel } from './examen-model';
import { StudentModel } from './student-model';
import { RateModel } from './rate-model';

export class ExamenRowModel {
    examen: ExamenModel;
    rate: RateModel;
    studentID: any;
    student: StudentModel;
}
