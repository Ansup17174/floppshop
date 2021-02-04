import OrderInfo from './OrderInfo';
import {useState, useEffect, useContext} from 'react';
import {useHistory} from 'react-router-dom';
import UserContext from '../context/UserContext';
import axios from 'axios';


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

    const [errors, setErrors] = useState({});
    const [select, setSelect] = useState();
    const [readOnly, setReadOnly] = useState(false);
    const {userData, reloadUserData} = useContext(UserContext);
    const history = useHistory();

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
        axios.get("http://localhost:8000/shop/order/", {withCredentials: true})
        .then(response => {
            setOrder(response.data);
        })
        .catch(error => {
            if (error.response.status === 401) {
                reloadUserData();
                history.push("/login");
            }
            setOrder(error.response.data);
        });
    }, []);

    useEffect(() => {
        axios.get("http://localhost:8000/shop/methods/")
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
            console.log("xDDD");
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
            console.log("222");
            easyPackDiv.classList.add("hidden");
            setReadOnly(false);
        }
    }, [select]);

    const submitOrder = () => {
        axios.post("http://localhost:8000/shop/order/", {...formData, method: select}, {withCredentials: true})
        .then(response => {
            console.log(response.data);
            history.push("/");
        })
        .catch(error => {
            if (error.response.status === 401) {
                reloadUserData();
                history.push("/login");
            }
            setErrors(error.response.data);
            console.log(error.response.data);
        });
    };

    return (
        <>
        <OrderInfo order={order} />
        <div>
            <div className="shipping">
                <form className="shipping-form">
                    <h1>Address:</h1>
                    <input type="text" placeholder="Street" className="register-input" readOnly={readOnly} value={formData.street} onChange={e => setFormData({...formData, street: e.target.value})}/>
                    {errors.street && <div className="register-fail">{errors.street[0]}</div>}
                    <input type="text" placeholder="Number" className="register-input" readOnly={readOnly} value={formData.number} onChange={e => setFormData({...formData, number: e.target.value})}/>
                    {errors.number && <div className="register-fail">{errors.number[0]}</div>}
                    <input type="text" placeholder="Post Code" className="register-input" readOnly={readOnly} value={formData.post_code} onChange={e => setFormData({...formData, post_code: e.target.value})}/>
                    {errors.post_code && <div className="register-fail">{errors.post_code[0]}</div>}
                    <input type="text" placeholder="State" className="register-input" readOnly={readOnly} value={formData.state} onChange={e => setFormData({...formData, state: e.target.value})}/>
                    {errors.state && <div className="register-fail">{errors.state[0]}</div>}
                    <input type="text" placeholder="City" className="register-input" readOnly={readOnly} value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})}/>
                    {errors.city && <div className="register-fail">{errors.city[0]}</div>}
                </form>
                <div className="item-details-line"></div>
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
                    <div className="checkout-button" onClick={submitOrder}>Submit order</div>
                    {errors.detail && <div className="register-fail">Choose shipping method</div>}
                </div>
            </div>
        </div>
        </>
    );
};

export default Checkout;