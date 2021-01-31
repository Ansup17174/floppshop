import axios from 'axios';
import {useState, useEffect, useContext} from 'react';
import {useHistory} from 'react-router-dom';
import UserContext from '../context/UserContext';



const ActiveOrder = () => {

    const [order, setOrder] = useState({});
    const history = useHistory();
    const {userData} = useContext(UserContext);

    useEffect(() => {
        console.log(userData.pk);
        if (userData.pk) {
            const url = "http://localhost:8000/shop/orders/";
            axios.get(url, {withCredentials: true})
            .then(response => {
                setOrder(response.data);
            })
            .catch(error => {
                setOrder(error.response.data);
            });
        } else {
            history.push("/login");
        }
    });

    return (
        <div>
            {order.detail ? <div>No active order</div> : null}
            {order.id ? <div>{order.id}</div> : null}
        </div>
    );
};

export default ActiveOrder;