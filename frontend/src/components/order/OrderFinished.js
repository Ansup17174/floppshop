
const OrderFinished = ({order, selectOrder}) => {
    return (
        <div className="wide">
            <div className="gray-container data-link" onClick={() => selectOrder(order)}>
                <div className="data-container">
                    <div className="data-row"><span>Order ID: </span><span>{order.id}</span></div>
                    <div className="data-row"><span>Total price: </span><span>{order.total_price}zł</span></div>
                    <div className="data-row"><span>Quantity: </span><span>{order.quantity}</span></div>
                    <div className="data-row"><span>Date finished: </span><span>{order.date_finished}</span></div>
                    <div className="data-row"><span>Shipping method: </span><span>{order.method.name}</span></div>
                    <div className="data-row"><span>Shipping price: </span><span>{order.method.price}zł</span></div>
                    <div className="data-row"><span>Status: </span><span>{order.is_paid ? "Paid" : "Unpaid"}</span></div>
                    {order.is_paid && <div className="data-row"><span>Date paid: </span><span>{order.date_paid}</span></div>}
                </div>
            </div>
        </div>
    );
};

export default OrderFinished;