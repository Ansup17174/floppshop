

const ItemForm = ({item, setItem, errors, responseOk, handleSubmit}) => {
    return (
        <div className="register">
            <form className="login-form" onSubmit={handleSubmit}>
                <h1>Item form</h1>
                {responseOk && <div className="register-success">Item saved</div>}
                <div className="register-field">
                    <input type="text" className="register-input" placeholder="Name" value={item.name} onChange={e => setItem({...item, name: e.target.value})}/>
                    {errors.name && errors.name.map((message, index) => <div className="register-fail" key={index}>{message}</div>)}
                </div>
                <div className="register-field">
                    <input type="text" className="register-input" placeholder="Description" value={item.description} onChange={e => setItem({...item, description: e.target.value})}/>
                </div>
                <div className="register-field">
                    <input type="number" step="0.01" className="register-input" placeholder="Price" value={item.price} onChange={e => setItem({...item, price: e.target.value})}/>
                </div>
                <input type="submit" className="register-button register-input" value="Save"/>
            </form>
        </div>
    );
};

export default ItemForm;