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

    const [errors, setErrors] = useState({});
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

    const [select, setSelect] = useState("InPost");
    const [readOnly, setReadOnly] = useState(false);

    const {setUserData} = useContext(UserContext);
    const history = useHistory();

    useEffect(() => {
        axios.get("http://localhost:8000/auth/user/", {withCredentials: true})
        .then(response => {
            setUserData(response.data);
            axios.get("http://localhost:8000/shop/order/", {withCredentials: true})
            .then(response => {
                setOrder(response.data);
            })
            .catch(error => {
                setOrder({});
            })
        })
        .catch(error => {
            setUserData({});
            history.push("/login");
        })
    }, []);

    useEffect(() => {
        window.easyPackAsyncInit = () => {
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
    }, []);

    useEffect(() => {
        const easyPackDiv = document.getElementById("easypack-map");
        if (select === "InPost") {
            easyPackDiv.classList.remove("hidden");
            setReadOnly(true);
        } else {
            easyPackDiv.classList.add("hidden");
            setReadOnly(false);
        }
        setFormData({
            street: "",
            number: "",
            state: "",
            post_code: "",
            city: "",
            method: ""
        });
    }, [select]);

    return (
        <>
        <OrderInfo order={order} />
        <div className="shipping">
            <form className="shipping-form">
                <h1>Address:</h1>
                <input type="text" placeholder="Street" className="register-input" readOnly={readOnly} value={formData.street} onChange={e => setFormData({...formData, street: e.target.value})}/>
                <input type="text" placeholder="Number" className="register-input" readOnly={readOnly} value={formData.number} onChange={e => setFormData({...formData, number: e.target.value})}/>
                <input type="text" placeholder="Post Code" className="register-input" readOnly={readOnly} value={formData.post_code} onChange={e => setFormData({...formData, post_code: e.target.value})}/>
                <input type="text" placeholder="State" className="register-input" readOnly={readOnly} value={formData.state} onChange={e => setFormData({...formData, state: e.target.value})}/>
                <input type="text" placeholder="City" className="register-input" readOnly={readOnly} value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})}/>
            </form>
            <div className="item-details-line"></div>
            <div className="shipping-method">
                <h1>Shipping method: </h1>
                <select name="method" id="method" className="shipping-method-select" value={select} onChange={e => setSelect(e.target.value)}>
                    <option value="InPost">InPost</option>
                    <option value="UPS">UPS</option>
                </select>
                <div className="inpost-dropdown">
                    <div id="easypack-map"></div>
                </div>
            </div>
        </div>
        </>
    );
};

export default Checkout;