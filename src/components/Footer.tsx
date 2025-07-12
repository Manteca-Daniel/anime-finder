import "./Footer.css";

function Footer() {
    return (
        <footer className="footer">
            <p>
                © {new Date().getFullYear()} AnimeFinder Deluxe — Datos por{" "}
                <a href="https://jikan.moe/" target="_blank" rel="noopener noreferrer">
                    Jikan API
                </a>
            </p>
        </footer>
    );
}

export default Footer;
