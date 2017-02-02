export function addFirstZero(n) {
    let num = parseInt(n);
    return num < 10 ? '0' + n : n;
}