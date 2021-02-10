const OrderInfo = ({order}) => {
    return (
        <>
        {order.id ? <div className="gray-container">
                <h1>Active order</h1>
                <div className="data-container">
                    <div className="data-row"><span>Order ID: </span><span>{order.id}</span></div>
                    <div className="data-row"><span>Quantity: </span><span>{order.quantity}</span></div>
                    <div className="data-row"><span>Total price: </span><span>{order.total_price}zł</span></div>
                </div>
            </div> : <div className="gray-container"><h1>No active order</h1></div>}
        </>
    );
};

export default OrderInfo;