export class ExamenModel{    
    id: string;
    active: boolean;
    disciplineId: string;
    startTime: Date;
    endTime: Date;

    isShared: boolean;
    limit: number;

    students: Array<string>;

    public get getStartTime() : Date {
        return this.startTime;
    }
    public set setStartTime(value) {
        this.startTime = new Date(value);
    }
    public get getEndTime() {
        return this.endTime;
    }
    public set setEndTime(value) {
        this.endTime = new Date(value);
    }    
}