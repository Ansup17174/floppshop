

const RegisterPage = () => {
    return (
    <div className="register">
        <form className="register-form">
            <label htmlFor="email">E-mail:</label>
            <input type="email" id="email"/>
            <label htmlFor="first-name">First name:</label>
            <input type="text" id="first-name"/>
            <label htmlFor="last-name">Last name:</label>
            <input type="text" id="last-name"/>
            <label htmlFor="phone">Phone:</label>
            <input type="number" id="phone"/>
            <label htmlFor="date-of-birth">Date of birth:</label>
            <input type="date" id="date-of-birth"/>
            <label htmlFor="password1">Password:</label>
            <input type="password" id="password1"/>
            <label htmlFor="password2">Password again:</label>
            <input type="password" id="password2"/>
        </form>
    </div>
    );
};

export default RegisterPage;