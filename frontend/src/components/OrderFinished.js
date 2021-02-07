
const OrderFinished = ({order, selectOrder}) => {
    return (
        <>
        <div className="order order-finished" onClick={() => selectOrder(order)}>
            <div className="order-info">
                <div className="order-field"><span>Order ID: </span><span>{order.id}</span></div>
                <div className="order-field"><span>Total price: </span><span>{order.total_price}zł</span></div>
                <div className="order-field"><span>Quantity: </span><span>{order.quantity}</span></div>
                <div className="order-field"><span>Date finished: </span><span>{order.date_finished}</span></div>
                <div className="order-field"><span>Shipping method: </span><span>{order.method.name}</span></div>
                <div className="order-field"><span>Shipping price: </span><span>{order.method.price}zł</span></div>
                <div className="order-field"><span>Status: </span><span>{order.is_paid ? "Paid" : "Unpaid"}</span></div>
                {order.is_paid && <div className="order-field"><span>Date paid: </span><span>{order.date_paid}</span></div>}
            </div>
        </div>
        </>
    );
};

export default OrderFinished;