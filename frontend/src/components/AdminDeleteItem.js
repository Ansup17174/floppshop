import {useState, useEffect, useContext} from 'react';
import {useHistory, useParams, Link} from 'react-router-dom';
import UserContext from '../context/UserContext';
import axios from 'axios';

const AdminDeleteItem = () => {
    const { id } = useParams();
    const history = useHistory();
    const { reloadUserData } = useContext(UserContext);
    const [responseOk, setResponseOk] = useState(false);

    useEffect(() => {
        axios.delete(`http://localhost:8000/shop/admin/items/${id}/`, {withCredentials: true})
        .then(response => {
            setResponseOk(true);
        })
        .catch(error => {
            if (error.response.status === 403) {
                reloadUserData();
                history.push("/not-found");
            } else if (error.response.status === 401) {
                reloadUserData();
                history.push("/login");
            } else if (error.response.status === 404) {
                history.push("/not-found");
            } else {
                setResponseOk(false);
            }
        });
    }, []);

    return (
        <div className="main-text">
            <div>
                {responseOk ? <h2>Item deleted succesfully</h2>
                : <h3>Cannot delete item (Item is linked to other models such as users' orders)</h3>}
                <Link to="/admin-items"><div className="pay-button">Go back to items</div></Link>
            </div>
        </div>
    );
};

export default AdminDeleteItem;