import {useState, useEffect, useContext} from 'react';
import {useHistory} from 'react-router-dom';
import UserContext from '../../context/UserContext';
import apiInstance from '../../utils/api';

const UserProfile = () => {

    const [formData, setFormData] = useState({});
    const [errors, setErrors] = useState({});
    const [responseOk, setResponseOk] = useState(false);
    const [dateInputType, setDateInputType] = useState("text");
    const {userData, reloadUserData} = useContext(UserContext);
    const history = useHistory();
    const token = localStorage.getItem("floppauth");

    useEffect(() => {
        apiInstance.get("auth/user/", {withCredentials: true, headers: {"Authorization": `Bearer ${token}`}})
        .then(response => {
            setFormData(response.data);
        })
        .catch(error => {
            reloadUserData();
            history.push("/login");
        });
    }, []);

    const handleSubmit = e => {
        e.preventDefault();
        const url = "auth/user/";
        apiInstance.put(url, formData, {withCredentials: true, headers: {"Authorization": `Bearer ${token}`}})
        .then(response => {
            setResponseOk(true);
            setErrors({});
        })
        .catch(error => {
            if (error.response.status === 401) {
                reloadUserData();
                history.push("/login");
            }
            setResponseOk(false);
            setErrors(error.response.data);
        });
    };

    return (
        <div className="scrollable-page">
            <div className="form-container">
                <form className="form" onSubmit={handleSubmit}>
                    <h1>Profile info</h1>
                    {responseOk && <div className="form-success">Profile saved</div>}
                    <div className="form-field">
                        <div className="form-input">Id: {formData.pk}</div>
                    </div>
                    <div className="form-field">
                        <div className="form-input">E-mail: {formData.email}</div>
                    </div>
                    {userData.is_staff && <div className="form-field">
                        <div className="form-input">Is Admin: True</div>
                    </div>}
                    <div className="form-field">
                        First name: <input type="text" className="form-input" value={formData.first_name} placeholder="First name" onChange={e => setFormData({...formData, first_name: e.target.value})}/>
                        {errors.first_name && errors.first_name.map((message, index) => <div className="form-error" key={index}>{message}</div>) }
                    </div>
                    <div className="form-field">
                        Last name: <input type="text" className="form-input" value={formData.last_name} placeholder="Last name" onChange={e => setFormData({...formData, last_name: e.target.value})}/>
                        {errors.last_name && errors.last_name.map((message, index) => <div className="form-error" key={index}>{message}</div>)}
                    </div>
                    <div className="form-field">
                        Phone: <input type="text" className="form-input" value={formData.phone} placeholder="Phone number" onChange={e => setFormData({...formData, phone: e.target.value})}/>
                        {errors.phone && errors.phone.map((message, index) => <div className="form-error" key={index}>{message}</div>)}
                    </div>
                    <div className="form-field">
                        Date of birth: <input type={dateInputType}
                        className="form-input"
                        value={formData.date_of_birth}
                        placeholder="Date of birth"
                        onFocus={() => setDateInputType("date")}
                            onBlur={() => setDateInputType("text")}
                            onChange={e => setFormData({...formData, date_of_birth: e.target.value})}/>
                        {errors.date_of_birth && errors.date_of_birth.map((message, index) => <div className="form-error" key={index}>{message}</div>)}
                    </div>
                    <div className="form-field">
                        {errors.non_field_errors && errors.non_field_errors.map((message, index) => <div className="form-error" key={index}>{message}</div>)}
                    </div>
                    <input className="form-button form-input" type="submit" value="Save profile"/>
                </form>
            </div>
        </div>
    );
};

export default UserProfile;