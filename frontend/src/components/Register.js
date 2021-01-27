import axios from 'axios';
import {useState} from 'react';


const RegisterPage = () => {

    const [dateInputType, setDateInputType] = useState("text");
    const [formState, setFormState] = useState({
        email: "",
        firstName: "",
        lastName: "",
        phone: "",
        dateOfBirth: "",
        password1: "",
        password2: "",
        responseOk: false,
        responseLoading: false
    });
    const [errors, setErrors] = useState({});


    const handleSubmit = e => {
        e.preventDefault();
        setFormState({...formState, responseOk: false, responseLoading: true})
        setErrors({})
        const url = "http://localhost:8000/auth/registration/";
        axios.post(url, {
            email: formState.email,
            first_name: formState.firstName,
            last_name: formState.lastName,
            phone: formState.phone,
            date_of_birth: formState.dateOfBirth,
            password1: formState.password1,
            password2: formState.password2,
        })
        .then(response => {
            setFormState({...formState, responseOk: true, responseLoading: false});
            setErrors({});
        })
        .catch(error => {
            setFormState({...formState, responseOk: false, responseLoading: false});
            setErrors(error.response.data);
        });
    };


    return (
    <div className="register">
        <form className="register-form" onSubmit={handleSubmit}>
            <h1>Registration</h1>
            {formState.responseOk ? <div className="register-success">Verification e-mail sent</div> : null}
            {formState.responseLoading ? <div className="register-loading">Sending...</div> : null}
            <div className="register-field">
                <input type="email" className="register-input" id="email" value={formState.email} placeholder="E-mail" onChange={e => setFormState({...formState, email: e.target.value})}/>
                {errors.email ? errors.email.map((message, index) => <div className="register-fail" key={index}>{message}</div>) : null}
            </div>
            <div className="register-field">
                <input type="text" className="register-input" value={formState.firstName} placeholder="First name" onChange={e => setFormState({...formState, firstName: e.target.value})}/>
                {errors.first_name ? errors.first_name.map((message, index) => <div className="register-fail" key={index}>{message}</div>) : null}
            </div>
            <div className="register-field">
                <input type="text" className="register-input" value={formState.lastName} placeholder="Last name" onChange={e => setFormState({...formState, lastName: e.target.value})}/>
                {errors.last_name ? errors.last_name.map((message, index) => <div className="register-fail" key={index}>{message}</div>) : null}
            </div>
            <div className="register-field">
                <input type="text" className="register-input" value={formState.phone} placeholder="Phone number" onChange={e => setFormState({...formState, phone: e.target.value})}/>
                {errors.phone ? errors.phone.map((message, index) => <div className="register-fail" key={index}>{message}</div>) : null}
            </div>
            <div className="register-field">
                <input type={dateInputType}
                className="register-input"
                value={formState.dateOfBirth}
                placeholder="Date of birth"
                onFocus={() => setDateInputType("date")}
                    onBlur={() => setDateInputType("text")}
                    onChange={e => setFormState({...formState, dateOfBirth: e.target.value})}/>
                {errors.date_of_birth ? errors.date_of_birth.map((message, index) => <div className="register-fail" key={index}>{message}</div>) : null}
            </div>
            <div className="register-field">
                <input type="password" className="register-input" value={formState.password1} placeholder="Password" onChange={e => setFormState({...formState, password1: e.target.value})}/>
                {errors.password1 ? errors.password1.map((message, index) => <div className="register-fail" key={index}>{message}</div>) : null}
            </div>
            <div className="register-field">
                <input type="password" className="register-input" value={formState.password2} placeholder="Password again" onChange={e => setFormState({...formState, password2: e.target.value})}/>
                {errors.password2 ? errors.password2.map((message, index) => <div className="register-fail" key={index}>{message}</div>) : null}
                {errors.non_field_errors ? errors.non_field_errors.map((message, index) => <div className="register-fail" key={index}>{message}</div>) : null}
            </div>
            <input className="register-button register-input" type="submit" value="Register"/>
        </form>
    </div>
    );
};

export default RegisterPage;