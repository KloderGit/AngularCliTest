import { ExamenModel } from './examen-model';

export class RateModel {
    id: string;
    examenID: string;
    examen: ExamenModel;
    studentID: string;
    value: number;

    constructor(id: string, examenID: string, studentID: string, rate?) {
        this.id = id;
        this.examenID = examenID;
        this.studentID = studentID + ''; // ToString
        this.value = rate ? parseInt(rate) : undefined;
        this.value == 1 ? this.value = 2 : this.value;
    }
}
