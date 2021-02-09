import {useState, useEffect, useContext, useRef} from 'react';
import {useParams, useHistory} from 'react-router-dom';
import UserContext from '../../context/UserContext';
import axios from 'axios';

const AdminEditImages = () => {
    const { id } = useParams();
    const history = useHistory();
    const {reloadUserData} = useContext(UserContext);
    const [images, setImages] = useState([]);
    const imagesInput = useRef();
    const [responseOk, setResponseOk] = useState(false);
    const [errors, setErrors] = useState({});

    const getImages = id => {
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
    };

    useEffect(() => {
        getImages(id);
    }, []);

    const saveImages = e => {
        e.preventDefault();
        const images = imagesInput.current.files;
        if (images.length) {
            const formData = new FormData();
            [...images].forEach(image => formData.append("images", image));
            axios.patch(`http://localhost:8000/shop/admin/items/${id}/`, formData,
            {withCredentials: true, headers: {"content-type": "multipart/form-data"}})
            .then(response => {
                setResponseOk(true);
                setErrors({});
                getImages(id);
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
                }
            });
        } else {
            setResponseOk(false);
            setErrors({detail: "You must upload at least 1 image"});
        }
    };

    const setAsMain = imageId => {
        axios.put(`http://localhost:8000/shop/admin/items/images/${imageId}/`, {}, {withCredentials: true})
        .then(response => {
            getImages(id);
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
            }
        });
    };

    const deleteImage = imageId => {
        axios.delete(`http://localhost:8000/shop/admin/items/images/${imageId}/`, {withCredentials: true})
        .then(response => {
            getImages(id);
            setResponseOk(false);
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
            }
        });
    };

    return (
        <div className="order-page">
            <div className="order">
                <h1>Edit images</h1>
                <div className="images">
                    {images.map((image, index) => (
                        <div className="image-ordering" key={index}>
                            <img src={image.url} alt="item" key={index} className="edit-image"/>
                            <div>
                                {!image.is_main && <div className="pay-button" onClick={() => setAsMain(image.id)}>Set as main</div>}
                                {image.is_main && <div className="main-image-info">Main</div>}
                                <div className="delete-button" onClick={() => deleteImage(image.id)}>Delete</div>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="image-save">
                    {responseOk && <div className="register-success">{imagesInput.current.files.length} images saved</div>}
                    <div className="image-form">
                        Add images:
                        <input type="file" multiple ref={imagesInput}/>
                        <div className="pay-button" onClick={saveImages}>Save images</div>
                        {errors.detail && <div className="register-fail">{errors.detail}</div>}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminEditImages;