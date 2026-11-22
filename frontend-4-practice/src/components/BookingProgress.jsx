function BookingProgress() {
    return (
        <section className="booking-progress" aria-label="Этапы записи">
            <div className="progress-heading">
                <span className="progress-label">ОНЛАЙН-ЗАПИСЬ</span>
                <span className="step-counter">ШАГ 3 ИЗ 5</span>
            </div>

            <div className="booking-steps">
                <div className="step completed">1. Мастер</div>
                <div className="step completed">2. Услуга</div>
                <div className="step active" aria-current="step">
                    3. Дата и время
                </div>
                <div className="step">4. Контакты</div>
                <div className="step">5. Подтверждение</div>
            </div>
        </section>
    );
}

export default BookingProgress;
