export const MONTHS_NOMINATIVE = [
    "Январь", "Февраль", "Март", "Апрель",
    "Май", "Июнь", "Июль", "Август",
    "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"
];

export const MONTHS_GENITIVE = [
    "января", "февраля", "марта", "апреля",
    "мая", "июня", "июля", "августа",
    "сентября", "октября", "ноября", "декабря"
];

export const DAYS_OF_WEEK = [
    "Воскресенье", "Понедельник", "Вторник",
    "Среда", "Четверг", "Пятница", "Суббота"
];

export const WEEKDAY_SHORT = [
    "Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"
];

export function compareDates(a, b) {
    const first = new Date(a.year, a.month, a.day);
    const second = new Date(b.year, b.month, b.day);

    if (first < second) return -1;
    if (first > second) return 1;

    return 0;
}

export function isDateSelectable(day, month, year, today) {
    return compareDates(
        { day, month, year },
        today
    ) >= 0;
}

export function buildCalendarGrid(year, month) {
    const firstWeekday = (new Date(year, month, 1).getDay() + 6) % 7;
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const daysInPreviousMonth = new Date(year, month, 0).getDate();

    const cells = [];

    for (let i = 0; i < firstWeekday; i++) {
        cells.push({
            day: daysInPreviousMonth - firstWeekday + i + 1,
            otherMonth: true
        });
    }

    for (let day = 1; day <= daysInMonth; day++) {
        cells.push({
            day,
            otherMonth: false
        });
    }

    while (cells.length % 7 !== 0) {
        cells.push({
            day: cells.length - firstWeekday - daysInMonth + 1,
            otherMonth: true
        });
    }

    const weeks = [];

    for (let i = 0; i < cells.length; i += 7) {
        weeks.push(cells.slice(i, i + 7));
    }

    return weeks;
}

export function findFirstSelectableDay(year, month, today) {
    const daysCount = new Date(year, month + 1, 0).getDate();

    for (let day = 1; day <= daysCount; day++) {
        if (isDateSelectable(day, month, year, today)) {
            return day;
        }
    }

    return null;
}

export function formatDate(day, month, year) {
    const weekday = DAYS_OF_WEEK[new Date(year, month, day).getDay()];

    return `${weekday}, ${day} ${MONTHS_GENITIVE[month]} ${year}`;
}
