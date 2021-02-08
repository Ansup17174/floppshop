import {useEffect, useContext} from 'react';
import {useHistory, useParams} from 'react-router-dom';
import UserContext from '../context/UserContext';
import axios from 'axios';

const AdminDeleteItem = () => {
    const { id } = useParams();
    const history = useHistory();
    const { reloadUserData } = useContext(UserContext);

    useEffect(() => {
        axios.delete(`http://localhost:8000/shop/admin/items/${id}/`, {withCredentials: true})
        .then(response => {
            history.push("/admin-items");
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

    return null;
};

export default AdminDeleteItem;