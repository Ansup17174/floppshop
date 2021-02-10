import ShippingMethodForm from './ShippingMethodForm';
import {useState, useContext, useEffect} from 'react';
import {useHistory, useParams} from 'react-router-dom';
import UserContext from '../../context/UserContext';
import axios from 'axios';
import './admin.css';


const AdminCreateShipping = () => {

    const [shipping, setShipping] = useState({
       name: "",
       price: 0,
       is_available: false 
    });
    const [responseOk, setResponseOk] = useState(false);
    const [errors, setErrors] = useState({});
    const history = useHistory();
    const {reloadUserData} = useContext(UserContext);
    const { id } = useParams();

    useEffect(() => {
        axios.get(`http://localhost:8000/shop/admin/shipping-method/${id}/`, {withCredentials: true})
        .then(response => {
            setShipping(response.data);
        })
        .catch(error => {
            if (error.response.status === 403) {
                reloadUserData();
                history.push("/not-found");
            } else if (error.response.status === 401) {
                reloadUserData();
                history.push("/login");
            } else {
                history.push("/not-found");
            }
        });
    }, []);

    const handleSubmit = e => {
        e.preventDefault();
        axios.put(`http://localhost:8000/shop/admin/shipping-method/${id}/`, shipping, {withCredentials: true})
        .then(response => {
            setErrors({});
            setResponseOk(true);
        })
        .catch(error => {
            if (error.response.status === 403) {
                reloadUserData();
                history.push("/not-found");
            } else if (error.response.status === 401) {
                reloadUserData();
                history.push("/login");
            } else {
                setResponseOk(false);
                setErrors(error.response.data);
            }
        });
    };

    return (
        <ShippingMethodForm
        shipping={shipping}
        setShipping={setShipping}
        errors={errors}
        responseOk={responseOk}
        handleSubmit={handleSubmit} />
    );
};

export default AdminCreateShipping;