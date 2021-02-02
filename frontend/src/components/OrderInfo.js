

const OrderInfo = ({order}) => {
    return (
        <>
        {order.id ? <div className="order">
                <h1>Active order</h1>
                <div className="order-info">
                    <div className="order-field"><span>Order ID: </span><span>{order.id}</span></div>
                    <div className="order-field"><span>Quantity: </span><span>{order.quantity}</span></div>
                    <div className="order-field"><span>Total price: </span><span>{order.total_price}zł</span></div>
                </div>
            </div> : <div className="order"><h1>No active order</h1></div>}
            </>
    );
};

export default OrderInfo;