import { useEffect, useRef, useState } from "react";

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

import { fetchToday, fetchSlots } from "./api";

function App() {
    const [today, setToday] = useState(null);
    const [todayLoading, setTodayLoading] = useState(true);
    const [todayError, setTodayError] = useState(null);

    const [currentMonth, setCurrentMonth] = useState(null);
    const [currentYear, setCurrentYear] = useState(null);
    const [selectedDay, setSelectedDay] = useState(null);
    const [selectedTime, setSelectedTime] = useState(null);
    const [slots, setSlots] = useState([]);

    const [slotsLoading, setSlotsLoading] = useState(false);
    const [slotsError, setSlotsError] = useState(null);
    const [message, setMessage] = useState("");

    const latestRequestId = useRef(0);

    useEffect(() => {
        let active = true;

        fetchToday()
            .then((date) => {
                if (!active) return;

                const defaultDate = new Date(
                    date.year,
                    date.month,
                    date.day + 1
                );

                setToday(date);
                setCurrentMonth(defaultDate.getMonth());
                setCurrentYear(defaultDate.getFullYear());
                setSelectedDay(defaultDate.getDate());
                setSelectedTime(null);
                setSlots([]);
                setSlotsLoading(true);
            })
            .catch((error) => {
                if (active) {
                    setTodayError(error.message);
                }
            })
            .finally(() => {
                if (active) {
                    setTodayLoading(false);
                }
            });

        return () => {
            active = false;
        };
    }, []);

    useEffect(() => {
        if (
            !today ||
            selectedDay === null ||
            currentMonth === null ||
            currentYear === null
        ) {
            return;
        }

        const requestedDate = {
            day: selectedDay,
            month: currentMonth,
            year: currentYear
        };

        const requestId = ++latestRequestId.current;

        fetchSlots(requestedDate)
            .then((result) => {
                if (requestId !== latestRequestId.current) {
                    return;
                }

                const responseDate = result.date;

                if (
                    !responseDate ||
                    responseDate.day !== requestedDate.day ||
                    responseDate.month !== requestedDate.month ||
                    responseDate.year !== requestedDate.year
                ) {
                    throw new Error(
                        "Сервер вернул данные для другой даты"
                    );
                }

                if (!Array.isArray(result.slots)) {
                    throw new Error(
                        "Некорректный формат расписания"
                    );
                }

                setSlots(result.slots);
                setSlotsError(null);
            })
            .catch((error) => {
                if (requestId !== latestRequestId.current) {
                    return;
                }

                setSlots([]);
                setSlotsError(error.message);
            })
            .finally(() => {
                if (requestId === latestRequestId.current) {
                    setSlotsLoading(false);
                }
            });

        return () => {
            if (latestRequestId.current === requestId) {
                latestRequestId.current += 1;
            }
        };
    }, [today, selectedDay, currentMonth, currentYear]);

    function handleDayClick(day) {
        if (
            !today ||
            day === selectedDay ||
            !isDateSelectable(day, currentMonth, currentYear, today)
        ) {
            return;
        }

        latestRequestId.current += 1;

        setSelectedDay(day);
        setSelectedTime(null);
        setSlots([]);
        setSlotsError(null);
        setSlotsLoading(true);
        setMessage("");
    }

    function handleTimeClick(time) {
        if (slotsLoading || slotsError) {
            return;
        }

        const available = slots.some(
            (slot) => slot.time === time && slot.available
        );

        if (!available) {
            return;
        }

        setSelectedTime(time);
        setMessage("");
    }

    function handleMonthChange(offset) {
        if (!today) {
            return;
        }

        latestRequestId.current += 1;

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
        setSlots([]);
        setSlotsError(null);
        setSlotsLoading(day !== null);
        setMessage("");
    }

    function handleContinue() {
        if (
            selectedDay === null ||
            !selectedTime ||
            slotsLoading ||
            slotsError
        ) {
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

    const noSlotsDate = today
        ? new Date(today.year, today.month, today.day + 3)
        : null;

    const errorDate = today
        ? new Date(today.year, today.month, today.day + 4)
        : null;

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

                    {today && (
                        <p className="calendar-hint">
                            Для проверки: без слотов -{" "}
                            {formatDate(
                                noSlotsDate.getDate(),
                                noSlotsDate.getMonth(),
                                noSlotsDate.getFullYear()
                            ).toLowerCase()}; ошибка сервера -{" "}
                            {formatDate(
                                errorDate.getDate(),
                                errorDate.getMonth(),
                                errorDate.getFullYear()
                            ).toLowerCase()}
                        </p>
                    )}
                </div>

                {todayLoading ? (
                    <div className="status-panel" role="status">
                        Загрузка...
                    </div>
                ) : todayError ? (
                    <div className="status-panel status-error" role="alert">
                        Ошибка загрузки календаря: {todayError}
                    </div>
                ) : today && (
                    <>
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
                                loading={slotsLoading}
                                error={slotsError}
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
                    </>
                )}
            </main>

            <Footer />
        </div>
    );
}

export default App;
