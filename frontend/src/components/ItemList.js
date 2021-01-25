

const ItemList = ({items}) => {
    return (
        <div className="main-page">
            {items.map((item, index) => (
                <div className="item" key={index}>
                    <img src={item.images[0]} alt=""/>
                    <div className="item-info">
                        <div className="item-name">{item.name}</div>
                        <div className="item-description">{item.description}</div>
                        <div className="item-quantity">{item.quantity}</div>
                        {item.is_available ? <div className="item-is-available">Available</div> : <div className="item-not-available">Not available</div>}
                    </div>
                    <div className="item-price">{item.price}zł</div>
                </div>
            ))}
        </div>
    );
};
export default ItemList;