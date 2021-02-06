
const HistoryDetails = ({order, selectOrder}) => {

    return (
        <>
        <div className="order">
            <div className="order-info">
                <div className="container">
                    <div className="pay-button go-back" onClick={() => selectOrder({})}>Go back</div>
                </div>
                <div className="order-field"><span>Order ID: </span><span>{order.id}</span></div>
                <div className="order-field"><span>Total price: </span><span>{order.total_price}zł</span></div>
                <div className="order-field"><span>Quantity: </span><span>{order.quantity}</span></div>
                <div className="order-field"><span>Date finished: </span><span>{order.date_finished}</span></div>
                <div className="order-field"><span>Shipping method: </span><span>{order.method.name}</span></div>
                <div className="order-field"><span>Status: </span><span>{order.is_paid ? "Paid" : "Unpaid"}</span></div>
                {order.is_paid && <div className="order-field"><span>Date paid: </span><span>{order.date_paid}</span></div>}
            </div>
        </div>
        <div className="order">
        {order.carts.map((cart, index) => (
                    <div className="order-item" key={index}>
                        <img src={cart.item.images.length ? cart.item.images[0] : "https://i.stack.imgur.com/y9DpT.jpg"} alt="" className="item-image"></img>
                        <h2 className="item-header">{cart.item.name}</h2>
                        <div className="item-description">{cart.item.description}</div>
                        <div className="item-price">{cart.item.price}zł</div>
                        <h3>Total price: {cart.total_price}zł</h3>
                        <form className="quantity-form">
                            <div>
                                <div className="quantity-data">
                                    <div className="item-quantity">Quantity: {cart.quantity}</div>
                                </div>
                            </div>
                        </form>
                    </div>
                ))}
        </div>
        </>
    );
}

export default HistoryDetails;