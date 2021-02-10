import {Link, useHistory} from 'react-router-dom';
import UserContext from '../context/UserContext';
import {useContext} from 'react';
import axios from 'axios';
import './header.css'

const Header = () => {

    const {userData, reloadUserData} = useContext(UserContext);

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
            <Link to="/" className="logo"><div>FloppShop</div></Link>
            <ul className="nav-links">
                {userData.is_staff && <Link to="/admin-panel" className="nav-item"><li>Admin panel</li></Link>}
                {userData.pk && <Link to="/order-history" className="nav-item"><li>History</li></Link>}
                {userData.pk && <Link to="/order" className="nav-item"><li>Order</li></Link>}
                {userData.pk && <Link to="/profile" className="nav-item"><li>Profile</li></Link>}
                {userData.pk && <Link to="/change-password" className="nav-item"><li>Change password</li></Link>}
                <Link to="/register" className="nav-item"><li>Register</li></Link>
                {!userData.pk ? <Link to="/login" className="nav-item"><li>Log in</li></Link> : <div className="nav-item" onClick={logout}>Logout</div>}
            </ul>
        </nav>
    </div>
    );
};

export default Header;