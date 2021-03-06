import OrderInfo from './OrderInfo';
import {useState, useEffect, useContext} from 'react';
import {useHistory} from 'react-router-dom';
import UserContext from '../../context/UserContext';
import apiInstance from '../../utils/api';


const Checkout = () => {
    const [formData, setFormData] = useState({
        street: "",
        number: "",
        state: "",
        post_code: "",
        city: "",
        method: ""
    });
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
    const [methods, setMethods] = useState([]);
    const [payUUri, setPayUUri] = useState("");
    const [errors, setErrors] = useState({});
    const [select, setSelect] = useState();
    const [readOnly, setReadOnly] = useState(false);
    const {reloadUserData} = useContext(UserContext);
    const history = useHistory();
    const token = localStorage.getItem("floppauth");

    const asyncInitEasyPack = () => {
        // eslint-disable-next-line no-undef
        easyPack.init({});
        // eslint-disable-next-line no-undef
        easyPack.dropdownWidget('easypack-map', ({address_details}) => {
            setFormData({
                street: address_details.street,
                number: address_details.building_number,
                state: address_details.province,
                post_code: address_details.post_code,
                city: address_details.city
            });
        });
    };

    useEffect(() => {
        apiInstance.get("shop/order/", {withCredentials: true, headers: {"Authorization": `Bearer ${token}`}})
        .then(response => {
            setOrder(response.data);
        })
        .catch(error => {
            if (error.response.status === 401) {
                reloadUserData();
                history.push("/login");
            }
            history.push("/not-found");
        });
    }, []);

    useEffect(() => {
        apiInstance.get("shop/methods/")
        .then(response => {
            setMethods(response.data);
        });
    }, []);

    useEffect(() => {
        asyncInitEasyPack();
    }, []);

    useEffect(() => {
        const easyPackDiv = document.getElementById("easypack-map");
        if (select === "InPost") {
            easyPackDiv.classList.remove("hidden");
            setReadOnly(true);
            setFormData({
                street: "",
                number: "",
                state: "",
                post_code: "",
                city: "",
                method: ""
            });
        } else {
            easyPackDiv.classList.add("hidden");
            setReadOnly(false);
        }
    }, [select]);

    const submitOrder = () => {
        apiInstance.post("shop/order/", {...formData, method: select}, {withCredentials: true, headers: {"Authorization": `Bearer ${token}`}})
        .then(response => {
            apiInstance.post(`shop/payment/${order.id}/`, {}, {withCredentials: true, headers: {"Authorization": `Bearer ${token}`}})
            .then(response => {
                console.log(response.data);
                setPayUUri(response.data.redirectUri);
            })
            .catch(error => {
                console.log(error.response.data);
            })
        })
        .catch(error => {
            if (error.response.status === 401) {
                reloadUserData();
                history.push("/login");
            } else if (error.response.status === 404) {
                history.push("/order");
            }
            setErrors(error.response.data);
        });
    };

    return (
        <div className="wide">
            <OrderInfo order={order} />
            <div>
                <div className="shipping">
                        <form className="shipping-form">
                            <h1>Address:</h1>
                            <input type="text" placeholder="Street" className="form-input" readOnly={readOnly} value={formData.street} onChange={e => setFormData({...formData, street: e.target.value})}/>
                            {errors.street && <div className="form-error">{errors.street[0]}</div>}
                            <input type="text" placeholder="Number" className="form-input" readOnly={readOnly} value={formData.number} onChange={e => setFormData({...formData, number: e.target.value})}/>
                            {errors.number && <div className="form-error">{errors.number[0]}</div>}
                            <input type="text" placeholder="Post Code" className="form-input" readOnly={readOnly} value={formData.post_code} onChange={e => setFormData({...formData, post_code: e.target.value})}/>
                            {errors.post_code && <div className="form-error">{errors.post_code[0]}</div>}
                            <input type="text" placeholder="State" className="form-input" readOnly={readOnly} value={formData.state} onChange={e => setFormData({...formData, state: e.target.value})}/>
                            {errors.state && <div className="form-error">{errors.state[0]}</div>}
                            <input type="text" placeholder="City" className="form-input" readOnly={readOnly} value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})}/>
                            {errors.city && <div className="form-error">{errors.city[0]}</div>}
                        </form>
                    <div className="shipping-method">
                        <h1>Shipping method: </h1>
                        <div className="inpost-dropdown">
                            <div id="easypack-map"></div>
                        </div>
                        <select name="method" id="method" className="shipping-method-select" value={select} onChange={e => setSelect(e.target.value)}>
                            <option value={null} selected="true" disabled>-</option>
                            {methods.length && methods.map((method, index) => (
                            <option value={method.name} key={index}>{method.name} - {method.price}zł</option>
                            ))}
                        </select>
                        {!payUUri && <div className="checkout-button" onClick={submitOrder}>Submit order</div>}
                        {payUUri && <a href={payUUri} target="_blank" rel="noreferrer"><div className="order-details blue-button">Redirect to payment</div></a>}
                        {errors.detail && <div className="form-error">Choose shipping method</div>}
                        {errors.detail && <div className="form-error">{errors.detail}</div>}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;