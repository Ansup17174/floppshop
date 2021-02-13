import {useState, useEffect, useContext} from 'react';
import {useHistory} from 'react-router-dom';
import UserContext from '../../context/UserContext';
import ItemForm from './ItemForm';
import apiInstance from '../../utils/api';
import './admin.css';

const AdminCreateItem = () => {
    const [item, setItem] = useState({
        name: "",
        description: "",
        price: 0,
        quantity: 0,
        is_discount: false,
        old_price: 0,
        is_visible: false,
        is_available: false,
    });
    const [errors, setErrors] = useState({});
    const [responseOk, setResponseOk] = useState(false);
    const history = useHistory();
    const {reloadUserData} = useContext(UserContext);

    useEffect(() => {
        apiInstance.get("auth/user/", {withCredentials: true})
        .then(response => {
            if (!response.data.is_staff) {
                reloadUserData();
                history.push("not-found");
            }
        })
        .catch(error => {
            if (error.response.status === 401) {
                reloadUserData();
                history.push("/login");
            }
        });
    }, []);

    const handleSubmit = e => {
        e.preventDefault();
        apiInstance.post("shop/admin/items/", item, {withCredentials: true})
        .then(response => {
            const { id } = response.data;
            setErrors({});
            setResponseOk(true);
            history.push(`/admin-item-details/${id}`);
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
        <ItemForm item={item} setItem={setItem} errors={errors} responseOk={responseOk} handleSubmit={handleSubmit}/>
    );
};

export default AdminCreateItem;