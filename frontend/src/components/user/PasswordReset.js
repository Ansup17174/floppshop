import {useState} from 'react';
import axios from 'axios';

const PasswordReset = () => {

    const [email, setEmail] = useState("");
    const [responseOk, setResponseOk] = useState(false);
    const [errors, setErrors] = useState({});

    const handleSubmit = e => {
        e.preventDefault();
        axios.post("http://localhost:8000/auth/password/reset/", {email})
        .then(response => {
            setErrors({});
            setResponseOk(true);
        })
        .catch(error => {
            setResponseOk(false);
            setErrors(error.response.data); 
        });
    };

    return (
        <div className="form-container">
            <form className="small-form" onSubmit={handleSubmit}>
                <h1>Reset password</h1>
                {responseOk && <div className="form-success">Password reset e-mail sent</div>}
                <div className="form-field">
                    <input type="email" className="form-input" placeholder="E-mail" value={email} onChange={e => setEmail(e.target.value)}/>
                    {errors.email && errors.email.map((message, index) => <div className="form-error" key={index}>{message}</div>)}
                    {errors.non_field_errors && errors.non_field_errors.map((message, index) => <div className="form-error" key={index}>{message}</div>)}
                </div>
                <input type="submit" className="form-button form-input" value="Reset"/>
            </form>
        </div>
    );
};

export default PasswordReset;