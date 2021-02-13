import {useEffect, useContext} from 'react';
import {useHistory, Link} from 'react-router-dom';
import UserContext from '../../context/UserContext';
import apiInstance from '../../utils/api';
import './admin.css';

const AdminPanel = () => {
    const {reloadUserData} = useContext(UserContext);
    const history = useHistory();

    useEffect(() => {
        apiInstance.get("auth/user/", {withCredentials: true})
        .then(response => {
            if (!response.data.is_staff) {
                reloadUserData();
                history.push("/not-found");
            }
        })
        .catch(error => {
            reloadUserData();
            history.push("/login");
        });
    }, []);

    return (
        <div className="scrollable-page">
            <div className="admin-panel">
                <h1>Items:</h1>
                <div>
                    <Link to="/admin-items"><div className="blue-button">View items</div></Link>
                    <Link to="/admin-item-create"><div className="blue-button">Add item</div></Link>
                </div>
            </div>
            <div className="admin-panel">
                <h1>Shipping methods:</h1>
                <div>
                    <Link to="/admin-shippings"><div className="blue-button">View shipping methods</div></Link>
                    <Link to="/admin-create-shipping"><div className="blue-button">Add shipping method</div></Link>
                </div>
            </div>
            <div className="admin-panel">
                <h1>PayU notifications:</h1>
                <div className="blue-button">View notifications</div>
            </div>
        </div>
    );
};

export default AdminPanel;