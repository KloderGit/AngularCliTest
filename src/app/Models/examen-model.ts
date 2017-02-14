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
    public get getEndTime() : Date {
        return this.endTime;
    }
    public set setEndTime(value) {
        this.endTime = new Date(value);
    }

    static map(object: {
        id?: string,
        active?: boolean | string,
        disciplineId?: string,
        startTime?: Date,
        endTime?: Date,
        isShared?: boolean,
        limit?: number,
        students?: Array<string>} ) { 

        let ex = new ExamenModel();
        ex.id = object.id || undefined;
        if (object.active && typeof object.active == 'string'){ ex.active = object.active == "Y"? true: false; }
        if (object.active && typeof object.active == 'boolean'){ ex.active = object.active; }
        ex.disciplineId = object.disciplineId || undefined;
        ex.isShared = object.isShared || undefined;
        ex.limit = object.limit || undefined;
        ex.students = object.students || [];
        ex.startTime = new Date(object.startTime) || undefined;
        ex.endTime = new Date(object.endTime) || undefined;

        return ex;
    }
}