import {
    MONTHS_NOMINATIVE,
    MONTHS_GENITIVE,
    WEEKDAY_SHORT,
    buildCalendarGrid,
    isDateSelectable
} from "../utils/date";

import { isNoSlotsDay } from "../data/slots";

function Calendar({
    currentMonth,
    currentYear,
    selectedDay,
    today,
    noSlotsDate,
    onDayClick,
    onMonthChange
}) {
    const cells = buildCalendarGrid(currentYear, currentMonth).flat();

    return (
        <section className="calendar" aria-label="Календарь записи">
            <div className="calendar-header">
                <h2 className="calendar-month">
                    {MONTHS_NOMINATIVE[currentMonth]} {currentYear}
                </h2>

                <div className="calendar-arrows">
                    <button
                        className="arrow-btn"
                        type="button"
                        aria-label="Предыдущий месяц"
                        onClick={() => onMonthChange(-1)}
                    >
                        ‹
                    </button>

                    <button
                        className="arrow-btn"
                        type="button"
                        aria-label="Следующий месяц"
                        onClick={() => onMonthChange(1)}
                    >
                        ›
                    </button>
                </div>
            </div>

            <div className="calendar-grid" aria-label="Дни месяца">
                {WEEKDAY_SHORT.map((weekday) => (
                    <span className="weekday" key={weekday}>
                        {weekday}
                    </span>
                ))}

                {cells.map((cell, index) => {
                    const selectable =
                        !cell.otherMonth &&
                        isDateSelectable(
                            cell.day,
                            currentMonth,
                            currentYear,
                            today
                        );

                    const selected =
                        selectable && cell.day === selectedDay;

                    const noSlots =
                        selectable &&
                        isNoSlotsDay(
                            cell.day,
                            currentMonth,
                            currentYear,
                            noSlotsDate
                        );

                    const classes = [
                        "day",
                        cell.otherMonth ? "other-month" : "",
                        !selectable ? "disabled" : "",
                        noSlots ? "no-slots" : "",
                        selected ? "selected" : ""
                    ].filter(Boolean).join(" ");

                    return (
                        <button
                            key={`${currentYear}-${currentMonth}-${index}`}
                            type="button"
                            className={classes}
                            disabled={!selectable}
                            aria-label={`${cell.day} ${MONTHS_GENITIVE[currentMonth]}`}
                            aria-pressed={selected}
                            onClick={() => onDayClick(cell.day)}
                        >
                            {cell.day}
                        </button>
                    );
                })}
            </div>
        </section>
    );
}

export default Calendar;
