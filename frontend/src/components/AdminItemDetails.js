import axios from 'axios';
import {useState, useEffect, useContext} from 'react';
import {useParams, useHistory, Link} from 'react-router-dom';
import UserContext from '../context/UserContext';

const AdminItemDetails = () => {

    const [item, setItem] = useState({
        name: "",
        description: "",
        quantity: "",
        price: 0,
        images: []
    });
    const [selectedImage, setSelectedImage] = useState("https://i.stack.imgur.com/y9DpT.jpg")
    const {reloadUserData} = useContext(UserContext);
    const [quantity, setQuantity] = useState(1);
    const [response, setResponse] = useState(false);
    const [error, setError] = useState({});
    const { id } = useParams();
    const history = useHistory();

    useEffect(() => {
        const url = `http://localhost:8000/shop/admin/items/${id}/`;
        axios.get(url, {withCredentials: true})
        .then(response => {
            setItem(response.data);
            if (response.data.images.length > 0) {
                setSelectedImage(response.data.images[0].url);
            }
        })
        .catch(error => {
            if (error.response.status === 403) {
                reloadUserData();
            }
            history.push("/not-found");
        });
    }, []);

    const changeQuantity = e => {
        if (e.target.value > 0) {
            setQuantity(Number.parseInt(e.target.value));
        } else {
            setQuantity(1);
        }
    };

    const increaseQuantity = () => {
        setQuantity(quantity+1);
    };

    const decreaseQuantity = () => {
        if (quantity > 0) {
            setQuantity(quantity-1);
        }
    };

    const handleSubmit = e => {
        e.preventDefault();
        reloadUserData();
        const url = `http://localhost:8000/shop/items/${id}/`;
        axios.post(url, {}, {withCredentials: true, params: {quantity}})
        .then(response => {
            setResponse(response.data);
            setError({});
        })
        .catch(error => {
            if (error.response.status === 401) {
                history.push("/login");
            }
            setResponse({});
            setError(error.response.data);
        });
    };

    return (
        <div className="item-details-container">
            <div className="item-details">
                <div className="item-details-images">
                    <img src={selectedImage} alt="item" className="item-details-image"/>
                    <div className="item-details-small-images">
                        {item.images.map((image, index) => (
                            <img src={image.url} alt="item-small" key={index} className="item-details-small-image"
                            onClick={e => setSelectedImage(e.target.src)}/>
                        ))}
                    </div>
                    <Link to={`/admin-edit-item-images/${id}`}><div className="pay-button">Edit images</div></Link>
                </div>
                <div className="item-details-line"></div>
                <div className="item-details-info">
                    <div className="item-details-name">{item.name}</div>
                    <div className="item-details-description">{item.description}</div>
                    <div className="item-details-bottom">
                        <div className="item-quantity">In-stock: {item.quantity}</div>
                        {item.is_discount && <span className="item-old-price">{item.old_price}zl</span>}
                        <span className={item.is_discount ? "item-discount-price" : "item-price"}>{item.price}zl</span>
                        {item.is_discount && <h4 className="on-discount">ON DISCOUNT!</h4>}
                    </div>
                    {item.is_available && item.quantity > 0 ? <form className="quantity-form" onSubmit={handleSubmit}>
                        <div className="quantity-data">
                            <div className="item-quantity">Quantity: </div>
                            <div className="quantity-buttons">
                                <div onClick={decreaseQuantity} className="sign-box">-</div>
                                <input type="number" className="quantity-input" value={quantity} onChange={changeQuantity}/>
                                <div onClick={increaseQuantity} className="sign-box">+</div>
                            </div>
                        </div>
                        <input type="submit" value="Add to cart" className="add-to-cart"/>
                        {response.detail && <div className="quantity-success">{response.detail}</div>}
                        {error.detail && <div className="quantity-fail">{error.detail}</div>}
                    </form> : <div className="add-to-cart-unavailable">Item unavailable</div>}
                    <div className="container">
                        <Link to={`/admin-edit-item/${id}`}><div className="pay-button">Edit item</div></Link>
                        <Link to={`/admin-delete-item/${id}`}><div className="delete-button">Delete item</div></Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminItemDetails;