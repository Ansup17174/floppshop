

const ItemForm = ({item, setItem, errors, responseOk, handleSubmit}) => {
    return (
        <div className="form-container">
            <form className="form" onSubmit={handleSubmit}>
                <h1>Item form</h1>
                {responseOk && <div className="form-success">Item saved</div>}
                <div className="form-field">
                    Name:
                    <input type="text" className="form-input" placeholder="Name" value={item.name} onChange={e => setItem({...item, name: e.target.value})}/>
                    {errors.name && errors.name.map((message, index) => <div className="form-error" key={index}>{message}</div>)}
                </div>
                <div className="form-field">
                    Description:
                    <input type="text" className="form-input" placeholder="Description" value={item.description} onChange={e => setItem({...item, description: e.target.value})}/>
                    {errors.description && errors.description.map((message, index) => <div className="form-error" key={index}>{message}</div>)}
                </div>
                <div className="form-field">
                    Quantity:
                    <input type="number" className="form-input" placeholder="Quantity" value={item.quantity} onChange={e => setItem({...item, quantity: e.target.value})}/>
                    {errors.quantity && errors.quantity.map((message, index) => <div className="form-error" key={index}>{message}</div>)}
                </div>
                <div className="form-field">
                    Price:
                    <input type="number" step="0.01" className="form-input" placeholder="Price" value={item.price} onChange={e => setItem({...item, price: e.target.value})}/>
                    {errors.price && errors.price.map((message, index) => <div className="form-error" key={index}>{message}</div>)}
                </div>
                <div className="form-field">
                    Old price (shown on discount):
                    <input type="number" step="0.01" className="form-input" placeholder="Old price (shown on discount)" value={item.old_price} onChange={e => setItem({...item, old_price: e.target.value})}/>
                    {errors.old_price && errors.old_price.map((message, index) => <div className="form-error" key={index}>{message}</div>)}
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
                <input type="submit" className="form-button form-input" value="Save"/>
            </form>
        </div>
    );
};

export default ItemForm;