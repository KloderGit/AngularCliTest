export function addFirstZero(n) {
    let num = parseInt(n);
    return num < 10 ? '0' + n : n;
}

export function getMonthName(date: Date){
	let str = date.toLocaleString("ru-ru", { month: "long" });
    return str.charAt(0).toUpperCase() + str.slice(1);
}