import axios from 'axios';
import {useState, useEffect, useContext} from 'react';
import {useHistory} from 'react-router-dom';
import UserContext from '../context/UserContext';
import OrderFinished from './OrderFinished';
import HistoryDetails from './HistoryDetails';

const History = () => {
    const [selectedOrder, setSelectedOrder] = useState({});
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
            {!selectedOrder.id && <div className="order">
                {orders.length && <h1>Order history</h1>}
                {!orders.length && <h1>No orders</h1>}
            </div>}
            {orders.length && !selectedOrder.id && orders.map((order, index) => (<OrderFinished order={order} key={index} selectOrder={setSelectedOrder}/>))}
            {selectedOrder.id && <HistoryDetails order={selectedOrder} selectOrder={setSelectedOrder}/>}
        </div>
    );
};

export default History;