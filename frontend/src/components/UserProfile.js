import {useState, useEffect, useContext} from 'react';
import {useHistory} from 'react-router-dom';
import UserContext from '../context/UserContext';
import axios from 'axios';

const UserProfile = () => {

    const [formData, setFormData] = useState({});
    const [errors, setErrors] = useState({});
    const [responseOk, setResponseOk] = useState(false);
    const [dateInputType, setDateInputType] = useState("text");
    const {reloadUserData} = useContext(UserContext);
    const history = useHistory();

    useEffect(() => {
        axios.get("http://localhost:8000/auth/user/", {withCredentials: true})
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
        reloadUserData();
        const url = "http://localhost:8000/auth/user/";
        axios.put(url, formData, {withCredentials: true})
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
    <div className="register">
        <form className="register-form" onSubmit={handleSubmit}>
            <h1>Profile info</h1>
            {responseOk ? <div className="register-success">Profile saved</div> : null}
            <div className="register-field">
                <div className="register-input" id="pk">Id: {formData.pk}</div>
            </div>
            <div className="register-field">
                <div className="register-input" id="email">E-mail: {formData.email}</div>
            </div>
            <div className="register-field">
                First name: <input type="text" className="register-input" value={formData.first_name} placeholder="First name" onChange={e => setFormData({...formData, first_name: e.target.value})}/>
                {errors.first_name ? errors.first_name.map((message, index) => <div className="register-fail" key={index}>{message}</div>) : null}
            </div>
            <div className="register-field">
                Last name: <input type="text" className="register-input" value={formData.last_name} placeholder="Last name" onChange={e => setFormData({...formData, last_name: e.target.value})}/>
                {errors.last_name ? errors.last_name.map((message, index) => <div className="register-fail" key={index}>{message}</div>) : null}
            </div>
            <div className="register-field">
                Phone: <input type="text" className="register-input" value={formData.phone} placeholder="Phone number" onChange={e => setFormData({...formData, phone: e.target.value})}/>
                {errors.phone ? errors.phone.map((message, index) => <div className="register-fail" key={index}>{message}</div>) : null}
            </div>
            <div className="register-field">
                Date of birth: <input type={dateInputType}
                className="register-input"
                value={formData.date_of_birth}
                placeholder="Date of birth"
                onFocus={() => setDateInputType("date")}
                    onBlur={() => setDateInputType("text")}
                    onChange={e => setFormData({...formData, date_of_birth: e.target.value})}/>
                {errors.date_of_birth ? errors.date_of_birth.map((message, index) => <div className="register-fail" key={index}>{message}</div>) : null}
            </div>
            <div className="register-field">
                {errors.non_field_errors ? errors.non_field_errors.map((message, index) => <div className="register-fail" key={index}>{message}</div>) : null}
            </div>
            <input className="register-button register-input" type="submit" value="Save profile"/>
        </form>
    </div>
    );
};

export default UserProfile;