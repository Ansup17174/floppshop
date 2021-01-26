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
        responseOk: false,
        responseErrors: []
    });


    const handleSubmit = e => {
        e.preventDefault();
    };


    return (
    <div className="register">
        <form className="register-form" onSubmit={handleSubmit}>
            <h1>Registration</h1>
            <div className={formState.responseOk ? "register-success" : "hidden"}>Verification e-mail sent</div>
            {formState.responseErrors.map((error, index) => (
                <div className="register-fail">{error}</div>
            ))}
            <input type="email" id="email" value={formState.email} placeholder="E-mail" onChange={e => setFormState({...formState, email: e.target.value})}/>
            <input type="text" value={formState.firstName} placeholder="First name" onChange={e => setFormState({...formState, firstName: e.target.value})}/>
            <input type="text" value={formState.lastName} placeholder="Last name" onChange={e => setFormState({...formState, lastName: e.target.value})}/>
            <input type="text" value={formState.phone} placeholder="Phone number" onChange={e => setFormState({...formState, phone: e.target.value})}/>
            <input type={dateInputType}
             value={formState.dateOfBirth}
              placeholder="Date of birth"
               onFocus={() => setDateInputType("date")}
                onBlur={() => setDateInputType("text")}
                 onChange={e => setFormState({...formState, dateOfBirth: e.target.value})}/>
            <input type="password" value={formState.password1} placeholder="Password" onChange={e => setFormState({...formState, password1: e.target.value})}/>
            <input type="password" value={formState.password2} placeholder="Password again" onChange={e => setFormState({...formState, password2: e.target.value})}/>
            <input className={formState.isValid ? "register-button" : ""} type="submit" value="Register" placeholder="Phone number"/>
        </form>
    </div>
    );
};

export default RegisterPage;