export const SLOT_TIMES = [
    "10:00",
    "11:30",
    "13:00",
    "15:30",
    "17:00",
    "18:30"
];

export function isNoSlotsDay(day, month, year, noSlotsDate) {
    return (
        day === noSlotsDate.getDate() &&
        month === noSlotsDate.getMonth() &&
        year === noSlotsDate.getFullYear()
    );
}

export function getSlotsForDate(day, month, year, noSlotsDate) {
    if (
        day === null ||
        isNoSlotsDay(day, month, year, noSlotsDate)
    ) {
        return [];
    }

    return SLOT_TIMES.map((time, index) => ({
        time,
        available: index !== 5 && (day + index) % 5 !== 0
    }));
}
