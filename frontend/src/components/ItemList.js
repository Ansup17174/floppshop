import {Link} from 'react-router-dom';

const ItemList = ({items}) => {


    return (
        <div className="item-list">
            {items.length ? items.map((item, index) => (
                <Link to={`/item-details/${item.id}`}><div className="item" key={index}>
                    <img src={item.images[0] ? item.images[0] : "https://i.stack.imgur.com/y9DpT.jpg"} alt=""/>
                    <div className="item-info" key={index}>
                        <div className="item-name">{item.name}</div>
                        <div className="item-quantity">In-stock: {item.quantity}</div>
                        {item.is_available && item.quantity > 0 ? <div className="item-is-available">Available</div> : <div className="item-not-available">Not available</div>}
                    </div>
                    <div className="item-price">{item.price}zł</div>
                </div></Link>
            )) : <div className="item-error">No items found</div>}
        </div>
    );
};
export default ItemList;