export const round = (num, digits) => {
    const factor = Math.pow(10, digits);

    return Math.round(num * factor) / factor;
}

export const math = {
    round
}
