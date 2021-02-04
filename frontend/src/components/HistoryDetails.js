import {useState} from 'react';


const HistoryDetails = () => {

    const [order, setOrder] = useState({
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

    

    return (
        <div className="order">
            <div className="order-info">
                <div className="order-field"><span>Order ID: </span><span>{order.id}</span></div>
                <div className="order-field"><span>Total price: </span><span>{order.total_price}zł</span></div>
                <div className="order-field"><span>Quantity: </span><span>{order.quantity}</span></div>
                <div className="order-field"><span>Date finished: </span><span>{order.date_finished}</span></div>
                <div className="order-field"><span>Shipping method: </span><span>{order.method.name}</span></div>
                <div className="order-field"><span>Status: </span><span>{order.is_paid ? "Paid" : "Unpaid"}</span></div>
                {order.is_paid && <div className="order-field"><span>Date paid: </span><span>{order.date_paid}</span></div>}
            </div>
        </div>
    );
}