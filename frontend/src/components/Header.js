import {Link} from 'react-router-dom';

const Header = () => {
    return (
    <div className="nav-wrapper">
        <nav className="navbar">
            <Link to="/" className="logo"><div>FloppShop</div></Link>
            <ul className="nav-links">
                <Link to="/contact" className="nav-item"><li>Contact</li></Link>
                <Link to="/register" className="nav-item"><li>Register</li></Link>
                <Link to="/login" className="nav-item"><li>Log in</li></Link>
            </ul>
        </nav>
    </div>
    );
};  

export default Header;