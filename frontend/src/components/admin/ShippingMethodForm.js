
const ShippingMethodForm = ({shipping, setShipping, errors, responseOk, handleSubmit}) => {

    return (
        <div className="register">
            <form className="login-form" onSubmit={handleSubmit}>
                <h1>Shipping method</h1>
                {responseOk && <div className="register-success">Shipping method saved</div>}   
                <div className="register-field">
                    Name: 
                    <input type="text" className="register-input" placeholder="Name" value={shipping.name} onChange={e => setShipping({...shipping, name: e.target.value})}/>
                    {errors.name && errors.name.map((message, index) => <div className="register-fail" key={index}>{message}</div>)}
                </div>
                <div className="register-field">
                    Price: 
                    <input type="number" className="register-input" step="0.01" placeholder="Price" value={shipping.price} onChange={e => setShipping({...shipping, price: e.target.value})}/>
                    {errors.price && errors.price.map((message, index) => <div className="register-fail" key={index}>{message}</div>)}
                </div>
                <div>
                    <input type="checkbox" checked={shipping.is_available} onChange={() => setShipping({...shipping, is_available: !shipping.is_available})}/>
                    <span> Is available</span>
                </div>
                <input type="submit" className="register-button register-input"/>
            </form>
        </div>
    );
};

export default ShippingMethodForm;