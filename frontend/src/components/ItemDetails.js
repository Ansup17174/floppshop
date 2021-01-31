import axios from 'axios';
import {useState, useEffect} from 'react';
import {useParams, useHistory} from 'react-router-dom';

const ItemDetails = () => {

    const [item, setItem] = useState({
        name: "",
        description: "",
        quantity: "",
        price: 0,

    });
    const [quantity, setQuantity] = useState(1);
    const [response, setResponse] = useState(false);
    const [error, setError] = useState({});
    const { id } = useParams();
    const history = useHistory();

    useEffect(() => {
        const url = `http://localhost:8000/shop/items/${id}/`;
        axios.get(url)
        .then(response => {
            setItem(response.data);
        })
        .catch(error => {
            history.push("/not-found");
        });
    }, []);

    const changeQuantity = e => {
        if (e.target.value > 0 && e.target.value <= item.quantity) {
            setQuantity(Number.parseInt(e.target.value));
        } else if (e.target.value > item.quantity) {
            setQuantity(item.quantity);
        } else {
            setQuantity(1);
        }
    };

    const increaseQuantity = () => {
        if (quantity < item.quantity) {
            setQuantity(quantity+1);
        }
    };

    const decreaseQuantity = () => {
        if (quantity > 1) {
            setQuantity(quantity-1);
        }
    };

    const handleSubmit = e => {
        e.preventDefault();
        axios.get("http://localhost:8000/auth/user/", {withCredentials: true})
        .then(response => {
            return;
        })
        .catch(error => {
            history.push("/login");
        });


        const url = `http://localhost:8000/shop/items/${id}/`;
        axios.post(url, {}, {withCredentials: true, params: {quantity}})
        .then(response => {
            setResponse(response.data);
            setError({});
        })
        .catch(error => {
            setResponse({});
            setError(error.response.data);
        });
    };

    return (
        <div className="item-details-container">
            <div className="item-details">
                <div className="item-details-images">
                    <img src="https://i.stack.imgur.com/y9DpT.jpg" alt="item" className="item-details-image"/>
                </div>
                <div className="item-details-line"></div>
                <div className="item-details-info">
                    <div className="item-details-name">{item.name}</div>
                    <div className="item-details-description">{item.description}</div>
                    <div className="item-details-bottom">
                        <div className="item-quantity">In-stock: {item.quantity}</div>
                        <span className="item-price">{item.price}zl</span>
                    </div>
                    {item.is_available || item.quantity <= 0 ? <form className="quantity-form" onSubmit={handleSubmit}>
                        <div className="quantity-data">
                            <div className="item-quantity">Quantity: </div>
                            <div className="quantity-buttons">
                                <div onClick={decreaseQuantity} className="sign-box">-</div>
                                <input type="number" className="quantity-input" value={quantity} onChange={changeQuantity}/>
                                <div onClick={increaseQuantity} className="sign-box">+</div>
                            </div>
                        </div>
                        <input type="submit" value="Add to cart" className="add-to-cart"/>
                    </form> : <div className="add-to-cart-unavailable">Item unavailable</div>}
                    {response.detail ? <div className="quantity-success">{response.detail}</div> : null}
                    {error.detail ? <div className="quantity-fail">{error.detail}</div> : null}
                </div>
            </div>
        </div>
    );
};

export default ItemDetails;