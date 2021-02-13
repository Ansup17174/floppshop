import ItemForm from './ItemForm';
import {useState, useEffect, useContext} from 'react';
import UserContext from '../../context/UserContext';
import {useHistory, useParams} from 'react-router-dom';
import apiInstance from '../../utils/api';
import './admin.css';

const AdminEditItem = () => {
    const { id } = useParams();
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
    const {reloadUserData} = useContext(UserContext);
    const history = useHistory();

    useEffect(() => {
        apiInstance.get(`shop/admin/items/${id}/`, {withCredentials: true})
        .then(response => {
            setItem(response.data);
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
        console.log();
        apiInstance.put(`shop/admin/items/${id}/`, item, {withCredentials: true})
        .then(response => {
            setResponseOk(true);
            setErrors({});
        })
        .catch(error => {
            if (error.response.status === 403) {
                reloadUserData();
                history.push("/not-found");
            } else if (error.response.status === 401) {
                reloadUserData();
                history.push("/login");
            } else {
                setErrors(error.response.data);
                setResponseOk(false);
            }
        });
    };

    return (
        <ItemForm item={item} setItem={setItem} errors={errors} responseOk={responseOk} handleSubmit={handleSubmit}/>
    );
};

export default AdminEditItem;