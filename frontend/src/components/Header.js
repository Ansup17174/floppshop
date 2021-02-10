import {Link, useHistory} from 'react-router-dom';
import UserContext from '../context/UserContext';
import {useState, useContext} from 'react';
import axios from 'axios';
import {FiAlignJustify, FiX} from 'react-icons/fi';
import './header.css'

const Header = () => {

    const {userData, reloadUserData} = useContext(UserContext);
    const [navbarToggled, setNavbarToggled] = useState(false);

    const history = useHistory();

    const logout = async () => {
        const url = "http://localhost:8000/auth/logout/"
        await axios.post(url, {}, {withCredentials: true})
        .then(response => {
            reloadUserData();
            history.push("/logout");
        })
    };

    return (
    <div className="nav-wrapper">
        <nav className="navbar">
            <Link to="/" className="logo" onClick={() => setNavbarToggled(false)}><div>FloppShop</div></Link>
            <ul className={`nav-links${navbarToggled ? "" : " not-displayed"}`}>
                {userData.is_staff && <Link to="/admin-panel" className="nav-item" onClick={() => setNavbarToggled(false)}><li>Admin panel</li></Link>}
                {userData.pk && <Link to="/order-history" className="nav-item" onClick={() => setNavbarToggled(false)}><li>History</li></Link>}
                {userData.pk && <Link to="/order" className="nav-item" onClick={() => setNavbarToggled(false)}><li>Order</li></Link>}
                {userData.pk && <Link to="/profile" className="nav-item" onClick={() => setNavbarToggled(false)}><li>Profile</li></Link>}
                {userData.pk && <Link to="/change-password" className="nav-item" onClick={() => setNavbarToggled(false)}><li>Change password</li></Link>}
                <Link to="/register" className="nav-item" onClick={() => setNavbarToggled(false)}><li>Register</li></Link>
                {!userData.pk ? <Link to="/login" className="nav-item" onClick={() => setNavbarToggled(false)}><li>Log in</li></Link> : <div className="nav-item" onClick={logout}>Logout</div>}
            </ul>
            <div className="nav-button" onClick={() => setNavbarToggled(!navbarToggled)}>{navbarToggled ? <FiX /> : <FiAlignJustify />}</div>
        </nav>
    </div>
    );
};

export default Header;