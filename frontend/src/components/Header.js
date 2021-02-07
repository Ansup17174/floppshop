import {Link, useHistory} from 'react-router-dom';
import UserContext from '../context/UserContext';
import {useContext, useEffect} from 'react';
import axios from 'axios';

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
                {userData.pk && <Link to="/order-history" className="nav-item"><li>History</li></Link>}
                {userData.pk && <Link to="/order" className="nav-item"><li>Order</li></Link>}
                {userData.pk && <Link to="/profile" className="nav-item"><li>Profile</li></Link>}
                <Link to="/register" className="nav-item"><li>Register</li></Link>
                {!userData.pk ? <Link to="/login" className="nav-item"><li>Log in</li></Link> : <div className="nav-item" onClick={logout}>Logout</div>}
            </ul>
        </nav>
    </div>
    );
};  

export default Header;