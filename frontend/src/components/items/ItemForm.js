

const ItemForm = ({item, setItem, errors, responseOk, handleSubmit}) => {
    return (
        <div className="register">
            <form className="register-form" onSubmit={handleSubmit}>
                <h1>Item form</h1>
                {responseOk && <div className="register-success">Item saved</div>}
                <div className="register-field">
                    Name:
                    <input type="text" className="register-input" placeholder="Name" value={item.name} onChange={e => setItem({...item, name: e.target.value})}/>
                    {errors.name && errors.name.map((message, index) => <div className="register-fail" key={index}>{message}</div>)}
                </div>
                <div className="register-field">
                    Description:
                    <input type="text" className="register-input" placeholder="Description" value={item.description} onChange={e => setItem({...item, description: e.target.value})}/>
                    {errors.description && errors.description.map((message, index) => <div className="register-fail" key={index}>{message}</div>)}
                </div>
                <div className="register-field">
                    Quantity:
                    <input type="number" className="register-input" placeholder="Quantity" value={item.quantity} onChange={e => setItem({...item, quantity: e.target.value})}/>
                    {errors.quantity && errors.quantity.map((message, index) => <div className="register-fail" key={index}>{message}</div>)}
                </div>
                <div className="register-field">
                    Price:
                    <input type="number" step="0.01" className="register-input" placeholder="Price" value={item.price} onChange={e => setItem({...item, price: e.target.value})}/>
                    {errors.price && errors.price.map((message, index) => <div className="register-fail" key={index}>{message}</div>)}
                </div>
                <div className="register-field">
                    Old price (shown as old price when item is on discount):
                    <input type="number" step="0.01" className="register-input" placeholder="Old price (shown as old when on discount)" value={item.old_price} onChange={e => setItem({...item, old_price: e.target.value})}/>
                    {errors.old_price && errors.old_price.map((message, index) => <div className="register-fail" key={index}>{message}</div>)}
                </div>
                <div className="checkbox-field">
                    <div>
                        <input type="checkbox" checked={item.is_discount} onChange={e => setItem({...item, is_discount: !item.is_discount})}/>
                        <span> Is discount</span>
                    </div>
                    <div>
                        <input type="checkbox" checked={item.is_available} onChange={e => setItem({...item, is_available: !item.is_available})}/>
                        <span> Is available</span>
                    </div>
                    <div>
                        <input type="checkbox" checked={item.is_visible} onChange={e => setItem({...item, is_visible: !item.is_visible})}/>
                        <span> Is visible</span>
                    </div>
                </div>
                <input type="submit" className="register-button register-input" value="Save"/>
            </form>
        </div>
    );
};

export default ItemForm;