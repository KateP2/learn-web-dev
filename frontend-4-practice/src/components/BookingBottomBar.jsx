import { formatDate } from "../utils/date";

function BookingBottomBar({
    selectedDay,
    selectedTime,
    currentMonth,
    currentYear,
    message,
    onBack,
    onContinue
}) {
    const selectedDate = selectedDay === null
        ? "Дата и время не выбраны"
        : `${formatDate(selectedDay, currentMonth, currentYear)} • ${selectedTime || "Время не выбрано"}`;

    return (
        <>
            <section className="visit-info" aria-label="Информация о визите">
                <h2 className="visit-label">ВАШ ВИЗИТ</h2>

                <p className="visit-description">
                    Анна Смирнова • Маникюр с покрытием гель-лак
                </p>

                <p className="visit-date" aria-live="polite">
                    {selectedDate}
                </p>
            </section>

            <div className="booking-actions">
                <button
                    className="back-btn"
                    type="button"
                    onClick={onBack}
                >
                    Назад
                </button>

                <button
                    className="continue-btn"
                    type="button"
                    disabled={!selectedTime}
                    onClick={onContinue}
                >
                    Продолжить
                </button>
            </div>

            <p className="action-message" role="status" aria-live="polite">
                {message}
            </p>
        </>
    );
}

export default BookingBottomBar;
