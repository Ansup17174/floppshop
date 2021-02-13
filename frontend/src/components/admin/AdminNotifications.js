import {useState, useEffect, useContext} from 'react';
import {useHistory} from 'react-router-dom';
import UserContext from '../../context/UserContext';
import apiInstance from '../../utils/api';

const AdminNotifications = () => {

    const [notifications, setNotifications] = useState([]);
    const [page, setPage] = useState(1);
    const [maxPage, setMaxPage] = useState(1);
    const history = useHistory();
    const {reloadUserData} = useContext(UserContext);

    const getNotifications = () => {
        apiInstance.get(`shop/admin/notifications/?limit=10&offset=${(page-1)*10}`, {withCredentials: true})
        .then(response => {
            setNotifications(response.data.results);
            setMaxPage(Math.floor((response.data.count-1) / 10) + 1);
        })
        .catch(error => {
            if (error.response.status === 403) {
                reloadUserData();
                history.push("/not-found");
            } else if (error.response.status === 401) {
                reloadUserData();
                history.push("/login");
            }
        });
    }

    useEffect(() => {
        getNotifications();
    }, [page]);

    const changePage = number => {
        if (number > 0 && number <= maxPage) {
            setPage(Number.parseInt(number));
        } else {
            setPage(1);
        }
    };

    return (
        <div className="scrollable-page">
            <div className="gray-container">
                {notifications.length > 0 && <><h1>Notifications</h1>
                <h3>Page: <input type="number" className="filter-form-input page-input white" value={page} onChange={e => changePage(e.target.value)}/> of {maxPage}</h3>
                <div className="page-buttons">
                    {page !== 1 && <span className="blue-button" onClick={() => changePage(page-1)}>&lt;</span>}
                    {page !== maxPage && <span className="blue-button" onClick={() => changePage(page+1)}>&gt;</span>}
                </div>
                </>}
                {notifications.map((notification, index) => <div className="gray-container" key={index}>{notification.content}</div>)}
                {!notifications.length > 0 && <h1>No notifications</h1>}
            </div>
        </div>
    );
};

export default AdminNotifications;