import { StudentModel } from './student-model';
import { RateModel } from './rate-model';

export class FormEditItem { 
    startTime: Date;
    endTime: Date;
    examenID: any;
    disciplineId: any;
    studentID: any;
    rates: RateModel[] = [];
    student: StudentModel;
}