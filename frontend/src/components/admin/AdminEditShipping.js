import ShippingMethodForm from './ShippingMethodForm';
import {useState, useContext, useEffect} from 'react';
import {useHistory, useParams} from 'react-router-dom';
import UserContext from '../../context/UserContext';
import apiInstance from '../../utils/api';
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
    const token = localStorage.getItem("floppauth");

    useEffect(() => {
        apiInstance.get(`shop/admin/shipping-method/${id}/`, {withCredentials: true, headers: {"Authorization": `Bearer ${token}`}})
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
        apiInstance.put(`shop/admin/shipping-method/${id}/`, shipping, {withCredentials: true, headers: {"Authorization": `Bearer ${token}`}})
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