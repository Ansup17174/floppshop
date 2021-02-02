import axios from 'axios';
import {useState, useEffect, useContext} from 'react';
import {useHistory, Link} from 'react-router-dom';
import UserContext from '../context/UserContext';
import OrderInfo from './OrderInfo';


const ActiveOrder = () => {

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
    const history = useHistory();
    const {reloadUserData} = useContext(UserContext);

    useEffect(() => {
        reloadUserData();
    }, []);

    const changeQuantity = (id, quantity) => {
        const url = `http://localhost:8000/shop/items/${id}/`;
        axios.post(url, {}, {withCredentials: true, params: {quantity}})
        .then(response => {
            axios.get("http://localhost:8000/shop/order/", {withCredentials: true})
            .then(response => {
                setOrder(response.data);
            })
            .catch(error => {
                setOrder(error.response.data);
            });
        })
        .catch(error => {
            history.push("login/");
        });
    };

    const compareCarts = (cart1, cart2) => {
        if (cart1.item.name < cart2.item.name) {
            return -1;
        } else if (cart1.item.name > cart2.item.name) {
            return 1;
        } else {
            return 0;
        }
    };

    return (
        <div className="order-page">
            <OrderInfo order={order} />
            {order.id ? <div className="order">
                <h1>Items</h1>
                {order.carts.sort(compareCarts).map((cart, index) => (
                    <div className="order-item" key={index}>
                        <img src={cart.item.images.length ? cart.item.images[0] : "https://i.stack.imgur.com/y9DpT.jpg"} alt="" className="item-image"></img>
                        <h2 className="item-header">{cart.item.name}</h2>
                        <div className="item-description">{cart.item.description}</div>
                        <div className="item-price">{cart.item.price}zł</div>
                        <h3>Total price: {cart.total_price}zł</h3>
                        <form className="quantity=form">
                            <div className="quantity-data">
                                <div className="item-quantity">Quantity: </div>
                                <div className="quantity-buttons">
                                    <div className="sign-box" onClick={() => changeQuantity(cart.item.id, -1)}>-</div>
                                    <span className="cart-quantity">{cart.quantity}</span>
                                    <div className="sign-box" onClick={() => changeQuantity(cart.item.id, 1)}>+</div>
                                </div>
                            </div>
                        </form>
                    </div>
                ))}
                <Link to="/checkout" className="checkout"><div className="checkout-button">Go to checkout &gt;</div></Link>
            </div> : null}
        </div>
    );
};

export default ActiveOrder;