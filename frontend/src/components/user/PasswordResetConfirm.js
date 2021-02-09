import {useParams} from 'react-router-dom';
import {useState, useEffect} from 'react';
import axios from 'axios';

const PasswordResetConfirm = () => {
    const [responseOk, setResponseOk] = useState(false);
    const [errors, setErrors] = useState({});
    const [newPassword1, setNewPassword1] = useState("");
    const [newPassword2, setNewPassword2] = useState("");
    const { uid, token } = useParams();

    const handleSubmit = e => {
        e.preventDefault();
        const url = "http://localhost:8000/auth/password/reset/confirm/";
        axios.post(url, {uid, token, new_password1: newPassword1, new_password2: newPassword2})
        .then(response => {
            setResponseOk(true);
            setErrors({});
        })
        .catch(error => {
            setResponseOk(false);
            setErrors(error.response.data);
        });
    };

    return (
        <div className="register">
            <form className="login-form" onSubmit={handleSubmit}>
                <h1>Set new password</h1>
                {responseOk && <div className="register-success">New password set</div>}
                <div className="register-field">
                    <input type="password" className="register-input" placeholder="New password" value={newPassword1} onChange={e => setNewPassword1(e.target.value)}/>
                    {errors.new_password1 && errors.new_password1.map((message, index) => <div className="register-fail" key={index}>{message}</div>)}
                </div>
                <div className="register-field">
                    <input type="password" className="register-input" placeholder="New password again" value={newPassword2} onChange={e => setNewPassword2(e.target.value)}/>
                    {errors.new_password2 && errors.new_password2.map((message, index) => <div className="register-fail" key={index}>{message}</div>)}
                    {errors.non_field_errors && errors.non_field_errors.map((message, index) => <div className="register-fail" key={index}>{message}</div>)}
                    {errors.token && errors.token.map((message, index) => <div className="register-fail" key={index}>{message}</div>)}
                </div>
                <input type="submit" className="register-button register-input" value="Set password"/>
            </form>
        </div>
    );
};

export default PasswordResetConfirm;