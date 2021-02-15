import ShippingMethodForm from './ShippingMethodForm';
import {useState, useContext, useEffect} from 'react';
import {useHistory} from 'react-router-dom';
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
    const {userData, reloadUserData} = useContext(UserContext);

    useEffect(() => {
        if (!userData.is_staff) {
            history.push("/not-found");
        } else if (!userData.pk) {
            reloadUserData();
            history.push("/login");
        }
    }, []);

    const handleSubmit = e => {
        e.preventDefault();
        const token = localStorage.getItem("floppauth");
        apiInstance.post("shop/admin/shipping-method/", shipping, {withCredentials: true, headers: {"Authorization": `Bearer ${token}`}})
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