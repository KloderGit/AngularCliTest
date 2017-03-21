import { ExamenModel } from './examen-model';

export class RateModel { 
    id: string;
    examenID: string;
    examen: ExamenModel;
    studentID: number;
    value: number;

    constructor(id: string, examenID: string, studentID: number, rate?) { 
        this.id = id;
        this.examenID = examenID;
        this.studentID = studentID;
        this.value = rate ? parseInt(rate) : undefined;
    }
}