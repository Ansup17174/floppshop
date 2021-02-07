import {useState, useContext} from 'react';
import {useHistory} from 'react-router-dom';
import UserContext from "../context/UserContext";
import axios from 'axios';


const Login = () => {

    const [formState, setFormState] = useState({
        email: "",
        password: ""
    });

    const [errors, setErrors] = useState({});
    const history = useHistory();
    const {reloadUserData} = useContext(UserContext);

    const handleSubmit = async e => {
        e.preventDefault();
        const url = "http://localhost:8000/auth/login/";
        await axios.post(url, {email: formState.email, password: formState.password}, {withCredentials: true})
        .then(response => {
            setErrors({});
            reloadUserData();
            history.push("/");
        })
        .catch(error => {
            setErrors(error.response.data);
        });
    };

    return (
        <div className="register">
            <form className="login-form" onSubmit={handleSubmit}>
                <h1>Login</h1>
                <div className="register-field">
                    <input type="email" className="register-input" placeholder="E-mail" value={formState.email} onChange={e => setFormState({...formState, email: e.target.value})}/>
                    {errors.email && errors.email.map((message, index) => <div className="register-fail" key={index}>{message}</div>)}
                </div>
                <div className="register-field">
                    <input type="password" className="register-input" placeholder="Password" value={formState.password} onChange={e => setFormState({...formState, password: e.target.value})}/>
                    {errors.password && errors.password.map((message, index) => <div className="register-fail" key={index}>{message}</div>)}
                    {errors.non_field_errors && errors.non_field_errors.map((message, index) => <div className="register-fail" key={index}>{message}</div>)}
                </div>
                <input type="submit" className="register-button register-input" value="Log in"/>
            </form>
        </div>
    );
};

export default Login;