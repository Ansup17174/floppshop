import {useState, useEffect, useContext} from 'react';
import {useHistory, Link} from 'react-router-dom';
import UserContext from '../../context/UserContext';
import apiInstance from '../../utils/api';
import './admin.css';

const AdminShippingList = () => {

    const [shippings, setShippings] = useState([]);
    const {reloadUserData} = useContext(UserContext);
    const history = useHistory();
    const token = localStorage.getItem("floppauth");

    useEffect(() => {
        apiInstance.get("shop/admin/shipping-method", {withCredentials: true, headers: {"Authorization": `Bearer ${token}`}})
        .then(response => {
            setShippings(response.data);
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
    }, []);

    return (
        <div className="wide">
            <div className="gray-container">
                {shippings.length ? <h1>Shipping methods</h1> : <h1>No shipping methods</h1>}
            </div>
            {shippings.map((shipping, index) => (
                <Link to={`/admin-edit-shipping/${shipping.id}/`} className="gray-container data-link">
                <div key={index}>
                    <div className="data-container">
                        <div className="data-row"><span>Name: </span><span>{shipping.name}</span></div>
                        <div className="data-row"><span>Price: </span><span>{shipping.price}zł</span></div>
                        <div className="data-row"><span>Is available: </span><span>{shipping.is_available ? "Yes": "No"}</span></div>
                    </div>
                </div>
                </Link>
            ))}
        </div>
    );
};

export default AdminShippingList;