import {useState, useEffect} from 'react';
import axios from 'axios';
import ItemList from './ItemList';


const FilterForm = () => {

    const [search, setSearch] = useState({
        text: "",
        minPrice: 0,
        maxPrice: 0,
    });

    const [items, setItems] = useState([]);
    const [orderBy, setOrderBy] = useState("");

    const changeText = e => {
        setSearch({...search, text: e.target.value});
    };

    const changeMinPrice = e => {
        setSearch({...search, minPrice: e.target.value});
    };

    const changeMaxPrice = e => {
        setSearch({...search, maxPrice: e.target.value});
    };

    const comparePrices = (item1, item2) => {
        const price1 = item1.is_discount ? item1.discount_price : item1.price;
        const price2 = item2.is_discount ? item2.discount_price : item2.price;
        return price1 - price2;
    };

    const handleSubmit = async e => {
        e.preventDefault();
        const url = "http://localhost:8000/shop/items/";
        let params = {
            search: search.text,
            min_price: search.minPrice,
            max_price: search.maxPrice,
        };
        await axios.get(url, {params})
        .then(response => {
            setItems(response.data);
        });
    };

    useEffect(() => {
        const url = "http://localhost:8000/shop/items/";
        axios.get(url)
        .then(response => {
            setItems(response.data);
        })
        .catch(error => {
            console.log(error.response);
            console.log(error.status);
        });
    }, []);

    useEffect(() => {
        if (orderBy) {
            if (orderBy === "ascending") {
                setItems([...items].sort(comparePrices));
            } else {
                setItems([...items].sort(comparePrices).reverse());
            }
        }
    }, [orderBy]);

    return (
        <>
        <div className="filter">
            <form className="filter-form" onSubmit={handleSubmit}>
                <div>
                    <h4>Filter by</h4>
                    <div>
                        <label htmlFor="searchText">Search by text:</label>
                        <input id="searchText" type="text" maxLength="100" size="25" autoComplete="off" value={search.text} onChange={changeText}/>
                    </div>
                    <div>
                        <label htmlFor="min-price">Price:</label>
                        <input id="min-price" type="number" size="2" min="0" value={search.minPrice} onChange={(changeMinPrice)}/>-
                        <input id="max-price" type="number" size="2" min="0" value={search.maxPrice} onChange={changeMaxPrice}/>
                    </div>
                </div>
                <input className="submit-button" type="submit" value="Filter"/>
                <div>
                    <h4>Order by</h4>
                    <label>Price:</label>
                    <div>
                        <input type="radio" name="price" id="price1" value="ascending" onChange={() => setOrderBy("ascending")}/>
                        <label htmlFor="price1">Ascending</label>
                        <input type="radio" name="price" id="price2" value="descending" onChange={() => setOrderBy("descending")}/>
                        <label htmlFor="price2">Descending</label> 
                    </div>
                </div>
            </form> 
        </div>
        <ItemList items={items}/>
        </>
    );
};

export default FilterForm;