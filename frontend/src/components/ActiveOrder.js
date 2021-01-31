import axios from 'axios';
import {useState, useEffect, useContext} from 'react';
import {useHistory} from 'react-router-dom';
import UserContext from '../context/UserContext';



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
    const {setUserData} = useContext(UserContext);

    useEffect(() => {
        axios.get("http://localhost:8000/auth/user/", {withCredentials: true})
        .then(response => {
            setUserData(response.data);
            axios.get("http://localhost:8000/shop/order/", {withCredentials: true})
            .then(response => {
                setOrder(response.data);
            })
            .catch(error => {
                setOrder(error.response.data);
            });
        })
        .catch(error => {
            setUserData({});
            history.push("/login");
        });
    }, []);

    const increaseQuantity = id => {
        console.log("dobra");
        const url = `http://localhost:8000/shop/items/${id}/`;
        axios.post(url, {}, {withCredentials: true, params: {quantity: 1}})
        .then(response => {
            // TODO
        })
    };

    const decreaseQuantity = id => {

    };

    return (
        <div className="order-page">
            <div className="order">
                <h1>Active order</h1>
                <div className="order-info">
                    <div className="order-field"><span>Order ID: </span><span>{order.id}</span></div>
                    <div className="order-field"><span>Quantity: </span><span>{order.quantity}</span></div>
                    <div className="order-field"><span>Total price: </span><span>{order.total_price}zl</span></div>
                </div>
            </div>
            <div className="order">
                <h1>Items</h1>
                {order.carts.map((cart, index) => (
                    <div className="order-item" key={index}>
                        <img src={cart.item.images.length ? cart.item.images[0] : "https://i.stack.imgur.com/y9DpT.jpg"} alt="" className="item-image"></img>
                        <h2 className="item-header">{cart.item.name}</h2>
                        <div className="item-description">{cart.item.description}</div>
                        <div className="item-price">{cart.item.price}zł</div>
                        <form className="quantity=form">
                            <div className="quantity-data">
                                <div className="item-quantity">Quantity: </div>
                                <div className="quantity-buttons">
                                    <div className="sign-box" onClick={() => decreaseQuantity(cart.item.id)}>-</div>
                                    <span className="cart-quantity">{cart.quantity}</span>
                                    <div className="sign-box" onClick={() => increaseQuantity(cart.item.id)}>+</div>
                                </div>
                            </div>
                        </form>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ActiveOrder;