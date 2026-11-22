function TimeSlots({
    selectedDay,
    selectedTime,
    slots,
    loading,
    error,
    onTimeClick
}) {
    let hint = "Выберите удобный временной слот";

    if (selectedDay === null) {
        hint = "Перейдите к следующему месяцу";
    } else if (loading) {
        hint = "Получаем свободное время с сервера";
    } else if (error) {
        hint = "Не удалось получить расписание";
    } else if (slots.length === 0) {
        hint = "Пожалуйста, выберите другой день";
    }

    return (
        <section className="time-selection" aria-label="Выбор времени">
            <h2 className="time-title">Доступное время</h2>

            <div className="time-grid" aria-live="polite">
                {selectedDay === null ? (
                    <p className="empty-slots">
                        В этом месяце нет доступных дат для записи.
                    </p>
                ) : loading ? (
                    <p className="empty-slots">
                        Загрузка слотов...
                    </p>
                ) : error ? (
                    <p className="empty-slots" role="alert">
                        Ошибка загрузки слотов: {error}
                    </p>
                ) : slots.length === 0 ? (
                    <p className="empty-slots">
                        На выбранную дату свободного времени нет.
                    </p>
                ) : (
                    slots.map((slot) => {
                        const classes = [
                            "time-slot",
                            !slot.available ? "occupied" : "",
                            selectedTime === slot.time ? "selected" : ""
                        ].filter(Boolean).join(" ");

                        return (
                            <button
                                key={slot.time}
                                type="button"
                                className={classes}
                                disabled={!slot.available}
                                aria-pressed={selectedTime === slot.time}
                                onClick={() => onTimeClick(slot.time)}
                            >
                                {slot.time}
                            </button>
                        );
                    })
                )}
            </div>

            <p className="time-hint">{hint}</p>
        </section>
    );
}

export default TimeSlots;
