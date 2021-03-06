import {Link} from 'react-router-dom';

const ItemList = ({items}) => {

    return (
        <div className="item-list">
            {items.length ? items.map((item, index) => (
                <Link to={`/admin-item-details/${item.id}`}><div className="item" key={index}>
                    <img src={item.images.length > 0 ? item.images[0].url : "https://i.stack.imgur.com/y9DpT.jpg"} alt="" className="item-image"/>
                    <div className="item-info" key={index}>
                        <div className="item-name">{item.name}</div>
                        <div className="item-quantity">In-stock: {item.quantity}</div>
                        <div className="item-price-container">
                            {item.is_discount && <div className="item-old-price">{item.old_price}zł</div>}
                            <div className={item.is_discount ? "item-discount-price" : "item-price"}>{item.price}zł</div>
                            {item.is_available && item.quantity > 0 ? <div className="item-is-available">Available</div> : <div className="item-not-available">Not available</div>}
                        </div>
                    </div>
                </div></Link>
            )) : <div className="item-error">No items found</div>}
        </div>
    );
};
export default ItemList;
