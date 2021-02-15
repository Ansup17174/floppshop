
const HistoryDetails = ({order, selectOrder}) => {

    return (
        <div className="wide">
            <div className="gray-container">
                <div className="data-container">
                    <div className="container">
                        <div className="blue-button go-back" onClick={() => selectOrder({})}>Go back</div>
                    </div>
                    <div className="data-row"><span>Order ID: </span><span>{order.id}</span></div>
                    <div className="data-row"><span>Total price: </span><span>{order.total_price}zł</span></div>
                    <div className="data-row"><span>Quantity: </span><span>{order.quantity}</span></div>
                    <div className="data-row"><span>Date finished: </span><span>{order.date_finished}</span></div>
                    <div className="data-row"><span>Shipping method: </span><span>{order.method.name}</span></div>
                    <div className="data-row"><span>Shipping price: </span><span>{order.method.price}</span></div>
                    <div className="data-row"><span>Status: </span><span>{order.is_paid ? "Paid" : "Unpaid"}</span></div>
                    {order.is_paid && <div className="data-row"><span>Date paid: </span><span>{order.date_paid}</span></div>}
                </div>
            </div>
            <div className="gray-container">
            {order.carts.map((cart, index) => (
                        <div className="order-item" key={index}>
                            <img src={cart.item.images.length ? cart.item.images[0].url : "https://i.stack.imgur.com/y9DpT.jpg"} alt="" className="item-image"></img>
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
        </div>
    );
}

export default HistoryDetails;