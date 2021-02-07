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
    const [page, setPage] = useState(1);
    const [maxPage, setMaxPage] = useState(1);
    const history = useHistory();

    const changePage = number => {
        if (number > 0 && number <= maxPage) {
            setPage(Number.parseInt(number));
        } else {
            setPage(1);
        }
    };

    const getOrderHistory = () => {
        axios.get(`http://localhost:8000/shop/order/?history&limit=10&offset=${(page-1)*10}`, {withCredentials: true})
        .then(response => {
            setOrders(response.data.results);
            setMaxPage(Math.floor((response.data.count-1) / 10) + 1);
        })
        .catch(error => {
            if (error.response.status === 401) {
                reloadUserData();
                history.push("/login");
            }
            console.log(error.response.data);
        });
    };

    useEffect(() => {
        getOrderHistory();
    }, [page]);

    return (
        <div className="order-page">
            {!selectedOrder.id && <div className="order">
                {orders.length > 0 && <><h1>Order history</h1>
                <h3>Page: <input type="number" className="page-input" value={page} onChange={e => changePage(e.target.value)}/> of {maxPage}</h3>
                <div className="page-buttons">
                    {page !== 1 && <span className="pay-button" onClick={() => changePage(page-1)}>&lt;</span>}
                    {page !== maxPage && <span className="pay-button" onClick={() => changePage(page+1)}>&gt;</span>}
                </div>
                </>}
                {!orders.length > 0 && <h1>No orders</h1>}
            </div>}
            {orders.length > 0 && !selectedOrder.id && orders.map((order, index) => <OrderFinished order={order} key={index} selectOrder={setSelectedOrder}/>)}
            {selectedOrder.id && <HistoryDetails order={selectedOrder} selectOrder={setSelectedOrder}/>}
        </div>
    );
};

export default History;