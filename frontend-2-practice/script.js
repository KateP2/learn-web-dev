const MONTHS_NOMINATIVE = [
    "Январь", "Февраль", "Март", "Апрель", "Май", "Июнь",
    "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"
];

const MONTHS_GENITIVE = [
    "января", "февраля", "марта", "апреля", "мая", "июня",
    "июля", "августа", "сентября", "октября", "ноября", "декабря"
];

const DAYS_OF_WEEK = [
    "Воскресенье", "Понедельник", "Вторник", "Среда",
    "Четверг", "Пятница", "Суббота"
];

const WEEKDAY_SHORT = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];
const SLOT_TIMES = ["10:00", "11:30", "13:00", "15:30", "17:00", "18:30"];

const now = new Date();
const today = {
    day: now.getDate(),
    month: now.getMonth(),
    year: now.getFullYear()
};


const noSlotsDate = new Date(today.year, today.month, today.day + 3);


const initialDate = new Date(today.year, today.month, today.day + 1);

const state = {
    currentMonth: initialDate.getMonth(),
    currentYear: initialDate.getFullYear(),
    selectedDay: initialDate.getDate(),
    selectedTime: null,
    slots: []
};

function compareDates(a, b) {
    const first = new Date(a.year, a.month, a.day);
    const second = new Date(b.year, b.month, b.day);
    if (first < second) return -1;
    if (first > second) return 1;
    return 0;
}

function isDateSelectable(day, month, year, referenceDate) {
    return compareDates({ day, month, year }, referenceDate) >= 0;
}

function buildCalendarGrid(year, month) {
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
        cells.push({ day, otherMonth: false });
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

function isNoSlotsDay(day, month, year) {
    return day === noSlotsDate.getDate()
        && month === noSlotsDate.getMonth()
        && year === noSlotsDate.getFullYear();
}

function getSlotsForDate(day, month, year) {
    if (day === null || isNoSlotsDay(day, month, year)) {
        return [];
    }

    return SLOT_TIMES.map((time, index) => ({
        time,
        available: index !== 5 && (day + index) % 5 !== 0
    }));
}

function findFirstSelectableDay(year, month) {
    const daysCount = new Date(year, month + 1, 0).getDate();
    for (let day = 1; day <= daysCount; day++) {
        if (isDateSelectable(day, month, year, today)) {
            return day;
        }
    }
    return null;
}

function formatDate(day, month, year) {
    const weekday = DAYS_OF_WEEK[new Date(year, month, day).getDay()];
    return `${weekday}, ${day} ${MONTHS_GENITIVE[month]} ${year}`;
}

function renderCalendar() {
    const monthTitle = document.querySelector("#calendar-month");
    const calendarGrid = document.querySelector("#calendar-grid");
    const weeks = buildCalendarGrid(state.currentYear, state.currentMonth);

    monthTitle.textContent = `${MONTHS_NOMINATIVE[state.currentMonth]} ${state.currentYear}`;
    let html = WEEKDAY_SHORT.map(day => `<span class="weekday">${day}</span>`).join("");

    weeks.forEach(week => {
        week.forEach(cell => {
            const selectable = !cell.otherMonth && isDateSelectable(
                cell.day, state.currentMonth, state.currentYear, today
            );
            const selected = !cell.otherMonth && cell.day === state.selectedDay;
            const noSlots = selectable && isNoSlotsDay(
                cell.day, state.currentMonth, state.currentYear
            );

            let classes = "day";
            if (cell.otherMonth) classes += " other-month";
            if (!selectable) classes += " disabled";
            if (noSlots) classes += " no-slots";
            if (selected) classes += " selected";

            html += `<button type="button" class="${classes}" data-day="${cell.day}"`
                + ` aria-label="${cell.day} ${MONTHS_GENITIVE[state.currentMonth]}"`
                + ` aria-pressed="${selected}"${selectable ? "" : " disabled"}>${cell.day}</button>`;
        });
    });

    calendarGrid.innerHTML = html;

    calendarGrid.querySelectorAll(".day:not(:disabled)").forEach(button => {
        button.addEventListener("click", onDayClick);
    });
}

function renderTimeSlots() {
    const timeGrid = document.querySelector("#time-grid");
    const hint = document.querySelector("#time-hint");

    if (state.selectedDay === null) {
        timeGrid.innerHTML = '<p class="empty-slots">В этом месяце нет доступных дат для записи.</p>';
        hint.textContent = "Перейдите к следующему месяцу";
        return;
    }

    if (state.slots.length === 0) {
        timeGrid.innerHTML = '<p class="empty-slots">На выбранную дату свободного времени нет.</p>';
        hint.textContent = "Пожалуйста, выберите другой день";
        return;
    }

    const html = state.slots.map(slot => {
        let classes = "time-slot";
        if (!slot.available) classes += " occupied";
        if (slot.time === state.selectedTime) classes += " selected";

        return `<button type="button" class="${classes}" data-time="${slot.time}"`
            + ` aria-pressed="${slot.time === state.selectedTime}"`
            + `${slot.available ? "" : " disabled"}>${slot.time}</button>`;
    }).join("");

    timeGrid.innerHTML = html;
    hint.textContent = "Выберите удобный временной слот";
    timeGrid.querySelectorAll(".time-slot:not(:disabled)").forEach(button => {
        button.addEventListener("click", onTimeSlotClick);
    });
}

function updateBottomBar() {
    const dateOutput = document.querySelector("#visit-date");
    const continueButton = document.querySelector("#continue-btn");

    if (state.selectedDay === null) {
        dateOutput.textContent = "Дата и время не выбраны";
    } else {
        const text = formatDate(state.selectedDay, state.currentMonth, state.currentYear);
        dateOutput.textContent = `${text} • ${state.selectedTime || "Время не выбрано"}`;
    }

    continueButton.disabled = !state.selectedTime;
}

function onDayClick(event) {
    const day = Number(event.currentTarget.dataset.day);
    if (!isDateSelectable(day, state.currentMonth, state.currentYear, today)) return;

    state.selectedDay = day;
    state.selectedTime = null; 
    state.slots = getSlotsForDate(day, state.currentMonth, state.currentYear);
    document.querySelector("#action-message").textContent = "";

    renderCalendar();
    renderTimeSlots();
    updateBottomBar();
}

function onTimeSlotClick(event) {
    const time = event.currentTarget.dataset.time;
    if (!state.slots.some(slot => slot.time === time && slot.available)) return;

    state.selectedTime = time;
    document.querySelector("#action-message").textContent = "";
    renderTimeSlots();
    updateBottomBar();
}

function changeMonth(offset) {

    const changed = new Date(state.currentYear, state.currentMonth + offset, 1);
    state.currentMonth = changed.getMonth();
    state.currentYear = changed.getFullYear();
    state.selectedDay = findFirstSelectableDay(state.currentYear, state.currentMonth);
    state.selectedTime = null;
    state.slots = getSlotsForDate(state.selectedDay, state.currentMonth, state.currentYear);
    document.querySelector("#action-message").textContent = "";

    renderCalendar();
    renderTimeSlots();
    updateBottomBar();
}

function setupMonthNavigation() {
    document.querySelector("#prev-month").addEventListener("click", () => changeMonth(-1));
    document.querySelector("#next-month").addEventListener("click", () => changeMonth(1));
}

function init() {
    state.slots = getSlotsForDate(state.selectedDay, state.currentMonth, state.currentYear);
    const hintDate = formatDate(
        noSlotsDate.getDate(), noSlotsDate.getMonth(), noSlotsDate.getFullYear()
    );
    document.querySelector("#calendar-hint").textContent =
        `Для проверки сценария без слотов выберите ${hintDate.toLowerCase()}`;

    setupMonthNavigation();
    renderCalendar();
    renderTimeSlots();
    updateBottomBar();

    document.querySelector(".booking-btn").addEventListener("click", () => {
        document.querySelector("#booking").scrollIntoView({ behavior: "smooth" });
    });

    document.querySelector("#continue-btn").addEventListener("click", () => {
        if (!state.selectedTime || state.selectedDay === null) return;
        document.querySelector("#action-message").textContent =
            `Вы выбрали ${formatDate(state.selectedDay, state.currentMonth, state.currentYear)}`
            + ` в ${state.selectedTime}. Следующий этап - ввод контактных данных.`;
    });

    document.querySelector("#back-btn").addEventListener("click", () => {
        document.querySelector("#action-message").textContent =
            "Предыдущий этап - выбор услуги. В этом задании реализована страница календаря.";
    });
}

window.addEventListener("DOMContentLoaded", init);
