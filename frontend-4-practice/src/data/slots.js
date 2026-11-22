export function isNoSlotsDay(day, month, year, noSlotsDate) {
    return (
        day === noSlotsDate.getDate() &&
        month === noSlotsDate.getMonth() &&
        year === noSlotsDate.getFullYear()
    );
}
