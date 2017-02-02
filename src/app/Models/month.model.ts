export class MonthGrid{

    year: number;
    month: number;
    countDays: number;

    weeks: cWeek[] = [];

    constructor(date: Date) {
        this.year = date.getFullYear();
        this.month = date.getMonth();
        this.countDays = 32 - new Date(this.year, this.month, 32).getDate();

        this.createGrid( new Date( this.year, this.month) );
    }

    private createGrid(date: Date){
        let countTableCells: number = Math.ceil((this.countDays + this.getDay(date)) / 7) * 7;
        let countTableRows: number = countTableCells / 7;
        
        let cellIndex = 1;
        let dayIndex: number = 1;

        let offsetWeekDay = this.getDay(date) + 1;

        for (let weekNumber = 0; weekNumber < countTableRows; weekNumber++) {

            let currentWeek: cWeek = new cWeek();

            for (let dayWeekNumber = 0; dayWeekNumber < 7; dayWeekNumber++) {

                let currentDay: cDay = new cDay();

                if (cellIndex < offsetWeekDay || cellIndex > ( this.countDays + offsetWeekDay - 1)) {
                    currentDay = new cDay();
                    currentDay.inmonth = false;
                    
                    let diff = offsetWeekDay - cellIndex;
                    let oldDate = new Date(this.year, this.month, 1);
                    oldDate.setDate(date.getDate() - diff);                     
                    currentDay.date = oldDate;
                } else {
                    currentDay = new cDay();
                    currentDay.inmonth = true;
                    let curDate = new Date(this.year, this.month, 1);
                    curDate.setDate(date.getDate() + (dayIndex -1));
                    currentDay.date = curDate;
                    dayIndex++;
                }

                currentWeek.days.push(currentDay);

                cellIndex++;
            }

            this.weeks.push(currentWeek);
        }
    }


    private getDay(date) { // получить номер дня недели, от 0(пн) до 6(вс)
        var day = date.getDay();
        if (day == 0) day = 7;
        return day - 1;
    }

}

class cWeek{
    days:  cDay[] =[];
}

class cDay{
    inmonth: boolean;
    date: Date;
}