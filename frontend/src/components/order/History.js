import apiInstance from '../../utils/api';
import {useState, useEffect, useContext} from 'react';
import {useHistory} from 'react-router-dom';
import UserContext from '../../context/UserContext';
import OrderFinished from './OrderFinished';
import HistoryDetails from './HistoryDetails';
import './order.css';

const History = () => {
    const [selectedOrder, setSelectedOrder] = useState({
        id: "",
        carts: [],
        address: "",
        method: {},
        total_price: "",
        is_finished: false,
        is_paid: false,
        date_created: "",
        date_finished: "",
        date_paid: "",
        quantity: 0
    });
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
        apiInstance.get(`shop/order/?history&limit=10&offset=${(page-1)*10}`, {withCredentials: true})
        .then(response => {
            setOrders(response.data.results);
            setMaxPage(Math.floor((response.data.count-1) / 10) + 1);
        })
        .catch(error => {
            if (error.response.status === 401) {
                reloadUserData();
                history.push("/login");
            }
        });
    };

    useEffect(() => {
        getOrderHistory();
    }, [page]);

    return (
        <div className="scrollable-page">
            {!selectedOrder.id && <div className="gray-container">
                {orders.length > 0 && <><h1>Order history</h1>
                <h3>Page: <input type="number" className="filter-form-input page-input white" value={page} onChange={e => changePage(e.target.value)}/> of {maxPage}</h3>
                <div className="page-buttons">
                    {page !== 1 && <span className="blue-button" onClick={() => changePage(page-1)}>&lt;</span>}
                    {page !== maxPage && <span className="blue-button" onClick={() => changePage(page+1)}>&gt;</span>}
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