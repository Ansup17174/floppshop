import axios from 'axios';
import {useState, useEffect, useContext} from 'react';
import {useHistory} from 'react-router-dom';
import UserContext from '../context/UserContext';



const ActiveOrder = () => {

    const [order, setOrder] = useState({});
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
            })
        })
        .catch(error => {
            setUserData({});
            history.push("/login");
        });
    }, []);

    return (
        <div>
            {order.detail ? <div>No active order</div> : null}
            {order.id ? <div>{order.id}</div> : null}
        </div>
    );
};

export default ActiveOrder;