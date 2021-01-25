import {useState, useEffect} from 'react';


const MainPage = () => {

    const [items, setItems] = useState([]);

    useEffect(() => {
        // TODO
    }, [items]);

    return (
        <div className="main-page">
            







            {/* <div className="item">
                <img src="https://upload.wikimedia.org/wikipedia/commons/b/ba/Catdryfood.jpg" alt="cat-food"/>
                <div className="item-info">
                    <div className="item-name">Cat food</div>
                    <div className="item-description">Cat food for cats, each pack is 1kg</div>
                    <div className="item-quantity">Available in-stock: 5</div>
                    <div className="item-is-available">Available</div>
                </div>
                <div className="item-price">21.99zł</div>
            </div> */}
        </div>
    );
};
export default MainPage;