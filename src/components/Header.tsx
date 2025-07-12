import { Link, useLocation } from "react-router-dom";
import "./Header.css";

function Header() {
    const { pathname } = useLocation();

    return (
        <header className="header">
            <div className="logo">
                <Link to="/">🎌 AnimeFinder</Link>
            </div>
            <nav className="nav">
                <Link to="/" className={pathname === "/" ? "active" : ""}>
                    Inicio
                </Link>
                <Link to="/favorites" className={pathname === "/favorites" ? "active" : ""}>
                    Favoritos
                </Link>
                <Link to="/minijuego">🎲 Minijuego</Link>
            </nav>
        </header>
    );
}

export default Header;
