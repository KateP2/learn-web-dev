import { useState } from "react";

import Header from "./components/Header";
import BookingProgress from "./components/BookingProgress";
import Calendar from "./components/Calendar";
import TimeSlots from "./components/TimeSlots";
import BookingBottomBar from "./components/BookingBottomBar";
import Footer from "./components/Footer";

import {
    formatDate,
    isDateSelectable,
    findFirstSelectableDay
} from "./utils/date";

import { getSlotsForDate } from "./data/slots";

const todayDate = new Date();

const today = {
    day: todayDate.getDate(),
    month: todayDate.getMonth(),
    year: todayDate.getFullYear()
};

const initialDate = new Date(
    today.year,
    today.month,
    today.day + 1
);

const noSlotsDate = new Date(
    today.year,
    today.month,
    today.day + 3
);

function App() {
    const [currentMonth, setCurrentMonth] = useState(initialDate.getMonth());
    const [currentYear, setCurrentYear] = useState(initialDate.getFullYear());
    const [selectedDay, setSelectedDay] = useState(initialDate.getDate());
    const [selectedTime, setSelectedTime] = useState(null);

    const [slots, setSlots] = useState(() =>
        getSlotsForDate(
            initialDate.getDate(),
            initialDate.getMonth(),
            initialDate.getFullYear(),
            noSlotsDate
        )
    );

    const [message, setMessage] = useState("");

    function handleDayClick(day) {
        if (!isDateSelectable(day, currentMonth, currentYear, today)) {
            return;
        }

        setSelectedDay(day);
        setSelectedTime(null);

        setSlots(
            getSlotsForDate(
                day,
                currentMonth,
                currentYear,
                noSlotsDate
            )
        );

        setMessage("");
    }

    function handleTimeClick(time) {
        const available = slots.some(
            slot => slot.time === time && slot.available
        );

        if (!available) {
            return;
        }

        setSelectedTime(time);
        setMessage("");
    }

    function handleMonthChange(offset) {
        const newDate = new Date(
            currentYear,
            currentMonth + offset,
            1
        );

        const month = newDate.getMonth();
        const year = newDate.getFullYear();

        const day = findFirstSelectableDay(
            year,
            month,
            today
        );

        setCurrentMonth(month);
        setCurrentYear(year);
        setSelectedDay(day);
        setSelectedTime(null);

        setSlots(
            getSlotsForDate(
                day,
                month,
                year,
                noSlotsDate
            )
        );

        setMessage("");
    }

    function handleContinue() {
        if (selectedDay === null || !selectedTime) {
            return;
        }

        const date = formatDate(
            selectedDay,
            currentMonth,
            currentYear
        );

        setMessage(
            `Вы выбрали ${date} в ${selectedTime}. Следующий этап - ввод контактных данных.`
        );
    }

    function handleBack() {
        setMessage(
            "Предыдущий этап - выбор услуги. В этом задании реализована страница календаря."
        );
    }

    const emptyDateText = formatDate(
        noSlotsDate.getDate(),
        noSlotsDate.getMonth(),
        noSlotsDate.getFullYear()
    ).toLowerCase();

    return (
        <div className="page">
            <Header />

            <BookingProgress />

            <main className="main-content" id="booking">
                <div className="calendar-intro">
                    <p className="section-label">
                        ШАГ 03 / КАЛЕНДАРЬ
                    </p>

                    <h1 className="page-title">
                        Выберите дату и время
                    </h1>

                    <p className="page-description">
                        Свободные даты мастера Анны Смирновой
                    </p>

                    <p className="calendar-hint">
                        Для проверки сценария без слотов выберите {emptyDateText}
                    </p>
                </div>

                <div className="booking-layout">
                    <Calendar
                        currentMonth={currentMonth}
                        currentYear={currentYear}
                        selectedDay={selectedDay}
                        today={today}
                        noSlotsDate={noSlotsDate}
                        onDayClick={handleDayClick}
                        onMonthChange={handleMonthChange}
                    />

                    <TimeSlots
                        selectedDay={selectedDay}
                        selectedTime={selectedTime}
                        slots={slots}
                        onTimeClick={handleTimeClick}
                    />
                </div>

                <BookingBottomBar
                    selectedDay={selectedDay}
                    selectedTime={selectedTime}
                    currentMonth={currentMonth}
                    currentYear={currentYear}
                    message={message}
                    onBack={handleBack}
                    onContinue={handleContinue}
                />
            </main>

            <Footer />
        </div>
    );
}

export default App;
