function Header() {
    return (
        <header className="header">
            <a href="#" className="logo">STUDIO ÉCLAT</a>

            <nav className="navigation" aria-label="Основная навигация">
                <a href="#" className="nav-link">Услуги</a>
                <a href="#" className="nav-link">Мастера</a>
                <a href="#" className="nav-link">Отзывы</a>
                <a href="#" className="nav-link">Контакты</a>
            </nav>

            <a href="#booking" className="booking-btn">
                Записаться
            </a>
        </header>
    );
}

export default Header;
