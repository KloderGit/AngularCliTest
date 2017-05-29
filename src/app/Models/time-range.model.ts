export class TimeRange {
    startTime: Date;
    endTime: Date;

    constructor(date) {
        this.startTime = new Date(date);
        this.endTime = new Date(date);
    }

    changeTime(x?, y?) {
        if (x) {
            this.startTime.setHours(x.hours); this.startTime.setMinutes(x.minutes);
        }
        if (y) {
            this.endTime.setHours(y.hours); this.endTime.setMinutes(y.minutes);
        }
    }
}