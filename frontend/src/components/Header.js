import {Link} from 'react-router-dom';
import UserContext from '../context/UserContext';
import {useContext} from 'react';

const Header = () => {

    const {userData} = useContext(UserContext);

    return (
    <div className="nav-wrapper">
        <nav className="navbar">
            <Link to="/" className="logo"><div>FloppShop</div></Link>
            <ul className="nav-links">
                {userData.pk ? <div className="nav-item">Logged in</div> : null}
                <Link to="/contact" className="nav-item"><li>Contact</li></Link>
                <Link to="/register" className="nav-item"><li>Register</li></Link>
                <Link to="/login" className="nav-item"><li>Log in</li></Link>
            </ul>
        </nav>
    </div>
    );
};  

export default Header;