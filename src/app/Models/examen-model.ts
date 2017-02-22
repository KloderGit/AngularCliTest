export class ExamenModel{    
    id: string = undefined;
    active: boolean = undefined;
    disciplineId: string = undefined;
    startTime: Date = undefined;
    endTime: Date = undefined;

    isShared: boolean = undefined;
    limit: number = undefined;

    students: Array<string> = [];

    public set setStartTime(value) {
        this.startTime = new Date(value);
    }

    public set setEndTime(value) {
        this.endTime = new Date(value);
    }

    static map(object: {
        id?,
        active?,
        disciplineId?,
        startTime?,
        endTime?,
        isShared?,
        limit?,
        students?
        }) { 

        let ex = new ExamenModel();

        ex.id = object.id || undefined;
        ex.disciplineId = object.disciplineId || undefined;

        if (object.active && typeof object.active == 'string'){ ex.active = object.active == "Y"? true: false; }
        if (object.active && typeof object.active == 'boolean'){ ex.active = object.active; }

        if (object.isShared && typeof object.isShared == 'string') { (object.isShared == 'Y' || object.isShared == 'Да') ? true : false; }    
        if (object.isShared && typeof object.isShared == 'boolean') { ex.isShared = object.isShared; }    

        ex.limit = object.limit? parseInt(object.limit) : undefined;

        ex.students = object.students;
        
        ex.startTime = new Date(object.startTime);
        ex.endTime = new Date(object.endTime);

        // console.log('Маппинг объекта - ', ex);

        return ex;
    }
}