
export class RateModel { 
    id: number;
    examenID: number;
    studentID: number;
    value: number;

    constructor(id: number, examenID: number, studentID: number, rate?) { 
        this.id = id;
        this.examenID = examenID;
        this.studentID = studentID;
        this.value = parseInt(rate);
    }
}