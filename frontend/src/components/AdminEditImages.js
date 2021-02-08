import {useState, useEffect, useContext, useRef} from 'react';
import {useParams, useHistory} from 'react-router-dom';
import UserContext from '../context/UserContext';
import axios from 'axios';

const AdminEditImages = () => {
    const { id } = useParams();
    const history = useHistory();
    const {reloadUserData} = useContext(UserContext);
    const [images, setImages] = useState([]);

    useEffect(() => {
        axios.get(`http://localhost:8000/shop/admin/items/${id}/`, {withCredentials: true})
        .then(response => {
            setImages(response.data.images);
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

    return (
        <div className="order">
            <h1>Edit images</h1>
            {images.map((image, index) => (<div><img src={image.url} alt="item" key={index}/>{image.ordering}</div>))}
        </div>
    );
};

export default AdminEditImages;