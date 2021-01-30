import axios from 'axios';
import {useState, useEffect} from 'react';
import {useParams, useHistory} from 'react-router-dom';

const ItemDetails = () => {

    const [item, setItem] = useState();
    const [quantity, setQuantity] = useState(1);
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
        if (e.target.value > 0) {
            setQuantity(e.target.value);
        }
    };

    const increaseQuantity = () => {
        setQuantity(quantity+1);
    };

    const decreaseQuantity = () => {
        if (quantity > 1) {
            setQuantity(quantity-1);
        }
    };

    return (
        <div className="item-details">
            <div className="item-details-images">
                <img src="https://i.stack.imgur.com/y9DpT.jpg" alt="item" className="item-details-image"/>
            </div>
            <div className="item-details-info">
                <div className="item-details-name">Name</div>
                <div className="item-details-description">Description Description Description Description Description
                Description Description Description Description Description
                Description Description Description Description Description
                </div>
                <div className="item-details-bottom">
                    <div className="item-quantity">In-stock: 100</div>
                    <span className="item-price">9.99zl</span>
                </div>
                <form className="quantity-form">
                    <div className="item-quantity">Quantity</div>
                    <div className="quantity-buttons">
                        <div onClick={decreaseQuantity} className="sign-box">-</div>
                        <input type="number" className="quantity-input" value={quantity} onChange={changeQuantity}/>
                        <div onClick={increaseQuantity} className="sign-box">+</div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ItemDetails;