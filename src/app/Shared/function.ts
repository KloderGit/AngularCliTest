export function addFirstZero(n) {
    let num = parseInt(n);
    return num < 10 ? '0' + n : n;
}

export function getMonthName(date: Date){
	let str = date.toLocaleString("ru-ru", { month: "long" });
    return str.charAt(0).toUpperCase() + str.slice(1);
}

export function diffTime( start: Date, end: Date, type?: string ){
        let res: number = +end - +start;

        if (type == 'minutes'){ res = ( +end - +start ) / 1000 / 60 ; }

		return res;
}

export function random(min, max){
    return Math.round(Math.random() * (max - min) + min);
}

export function getHoursString( time: Date ): string { 
    return addFirstZero(time.getHours()) + ':' + addFirstZero(time.getMinutes());
}

export function getDateString(time: Date): string {
    return time.getDate() + ' ' + Month[time.getMonth()] + ' ' + time.getFullYear() + ' г.';
}

enum Month { 
    Января,
    Февраля,
    Марта,
    Апреля,
    Мая,
    Июня,
    Июля,
    Августа,
    Сентября,
    Октября,
    Ноября,
    Декабря
}