import {useState, useEffect, useContext} from 'react';
import {useHistory, Link} from 'react-router-dom';
import UserContext from '../../context/UserContext';
import axios from 'axios';


const AdminShippingList = () => {

    const [shippings, setShippings] = useState([]);
    const {reloadUserData} = useContext(UserContext);
    const history = useHistory();

    useEffect(() => {
        axios.get("http://localhost:8000/shop/admin/shipping-method", {withCredentials: true})
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
        <div className="order-page">
            <div className="order">
                {shippings.length ? <h1>Shipping methods</h1> : <h1>No shipping methods</h1>}
            </div>
            {shippings.map((shipping, index) => (
                <Link to={`/admin-edit-shipping/${shipping.id}/`} className="order order-finished">
                <div key={index}>
                    <div className="order-info">
                        <div className="order-field"><span>Name: </span><span>{shipping.name}</span></div>
                        <div className="order-field"><span>Price: </span><span>{shipping.price}zł</span></div>
                        <div className="order-field"><span>Is available: </span><span>{shipping.is_available ? "Yes": "No"}</span></div>
                    </div>
                </div>
                </Link>
            ))}
        </div>
    );
};

export default AdminShippingList;