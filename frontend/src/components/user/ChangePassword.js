import {useState, useContext} from 'react';
import {useHistory} from 'react-router-dom';
import UserContext from '../../context/UserContext';
import axios from 'axios';

const ChangePassword = () => {

    const [oldPassword, setOldPassword] = useState("");
    const [newPassword1, setNewPassword1] = useState("");
    const [newPassword2, setNewPassword2] = useState("");
    const [responseOk, setResponseOk] = useState(false);
    const [errors, setErrors] = useState({});

    const {reloadUserData} = useContext(UserContext);
    const history = useHistory();

    const handleSubmit = e => {
        e.preventDefault();
        const requestData = {
            old_password: oldPassword,
            new_password1: newPassword1,
            new_password2: newPassword2
        };
        axios.post("http://localhost:8000/auth/password/change/", requestData, {withCredentials: true})
        .then(response => {
            setResponseOk(true);
            setErrors({});
        })
        .catch(error => {
            if (error.response.status === 401) {
                reloadUserData();
                history.push("/login");
            }
            setErrors(error.response.data);
            setResponseOk(false);
        });
    };

    return (
        <div className="form-container">
            <form className="small-form" onSubmit={handleSubmit}>
                <h1>Change password</h1>
                {responseOk && <div className="form-success">Password changed</div>}
                <div className="form-field">
                    <input type="password" className="form-input" placeholder="Old password" value={oldPassword} onChange={e => setOldPassword(e.target.value)}/>
                    {errors.old_password && errors.old_password.map((message, index) => <div className="form-error" key={index}>{message}</div>)}
                </div>
                <div className="form-field">
                    <input type="password" className="form-input" placeholder="New Password" value={newPassword1} onChange={e => setNewPassword1(e.target.value)}/>
                    {errors.new_password1 && errors.new_password1.map((message, index) => <div className="form-error" key={index}>{message}</div>)}
                </div>
                <div className="form-field">
                    <input type="password" className="form-input" placeholder="New password again" value={newPassword2} onChange={e => setNewPassword2(e.target.value)}/>
                    {errors.new_password2 && errors.new_password2.map((message, index) => <div className="form-error" key={index}>{message}</div>)}
                    {errors.non_field_errors && errors.non_field_errors.map((message, index) => <div className="form-error" key={index}>{message}</div>)}
                </div>
                <input type="submit" className="form-button form-input" value="Change password"/>
            </form>
        </div>
    );
};  

export default ChangePassword;