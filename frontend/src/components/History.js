import axios from 'axios';
import {useState, useEffect, useContext} from 'react';
import {useHistory} from 'react-router-dom';
import UserContext from '../context/UserContext';
import OrderFinished from './OrderFinished';

const History = () => {
    const [orders, setOrders] = useState([]);
    const {reloadUserData} = useContext(UserContext);
    const history = useHistory();

    useEffect(() => {
        axios.get("http://localhost:8000/shop/order/?history", {withCredentials: true})
        .then(response => {
            setOrders(response.data);
        })
        .catch(error => {
            if (error.response.status === 401) {
                reloadUserData();
                history.push("/login");
            }
            console.log(error.response.data);
        });
    }, []);

    return (
        <div className="order-page">
            <div className="order">
                {orders.length && <h1>Orders</h1>}
                {!orders.length && <h1>No orders</h1>}
            </div>
            {orders.length && orders.map((order, index) => (<OrderFinished order={order} key={index} />))}
        </div>
    );
};

export default History;