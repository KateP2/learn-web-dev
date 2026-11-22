function Footer() {
    return (
        <footer className="footer">
            <div className="footer-content">
                <div className="footer-brand">
                    <a href="#" className="footer-logo">STUDIO ÉCLAT</a>

                    <p className="footer-description">
                        Студия красоты и заботы о себе
                    </p>
                </div>

                <div className="footer-contacts">
                    <p className="footer-address">
                        Нижний Новгород, ул. Белинского, 18
                    </p>

                    <a href="tel:+79991234567" className="footer-phone">
                        +7 (999) 123-45-67
                    </a>
                </div>

                <div className="footer-hours">
                    <p className="working-hours">
                        Ежедневно с 10:00 до 21:00
                    </p>
                </div>
            </div>

            <p className="copyright">© 2026 Studio Éclat</p>
        </footer>
    );
}

export default Footer;
