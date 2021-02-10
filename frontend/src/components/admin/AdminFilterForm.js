import {useState, useEffect, useContext} from 'react';
import axios from 'axios';
import AdminItemList from './AdminItemList';
import {useHistory} from 'react-router-dom';
import UserContext from '../../context/UserContext';
import './admin.css';


const AdminFilterForm = () => {

    const [search, setSearch] = useState({
        text: "",
        minPrice: 0,
        maxPrice: 0,
        orderBy: ""
    });

    const [page, setPage] = useState(1);
    const [maxPage, setMaxPage] = useState(1);
    const [items, setItems] = useState([]);
    const history = useHistory();
    const {reloadUserData} = useContext(UserContext);

    const changeText = e => {
        setSearch({...search, text: e.target.value});
    };

    const changeMinPrice = e => {
        setSearch({...search, minPrice: e.target.value});
    };

    const changeMaxPrice = e => {
        setSearch({...search, maxPrice: e.target.value});
    };

    const changePage = number => {
        if (number > 0 && number <= maxPage) {
            setPage(Number.parseInt(number));
        } else {
            setPage(1);
        }
    };

    const getItems = () => {
        const url = `http://localhost:8000/shop/admin/items/?limit=10&offset=${(page-1)*10}`;
        let params = {
            search: search.text,
            min_price: search.minPrice,
            max_price: search.maxPrice,
            order_by: search.orderBy
        };
        axios.get(url, {withCredentials: true, params: params})
        .then(response => {
            setItems(response.data.results);
            setMaxPage(Math.floor((response.data.count - 1) / 10) + 1);
        })
        .catch(error => {
            if (error.response.status === 403) {
                reloadUserData();
                history.push("/not-found");
            } 
            console.log(error.response);
            console.log(error.status);
        });
    };

    const handleSubmit = async e => {
        e.preventDefault();
        getItems();
    };

    useEffect(() => {
        getItems();
    }, [page]);

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
                        <input type="radio" name="price" id="price1" value="+" onChange={e => setSearch({...search, orderBy: e.target.value})}/>
                        <label htmlFor="price1">Ascending</label>
                        <input type="radio" name="price" id="price2" value="-" onChange={e => setSearch({...search, orderBy: e.target.value})}/>
                        <label htmlFor="price2">Descending</label> 
                    </div>
                </div>
                    <h3>Page: <input type="number" value={page} onChange={e => changePage(e.target.value)}/> of {maxPage}</h3>
                    <div>
                        {page !== 1 && <span className="blue-button" onClick={() => changePage(page-1)}>&lt;</span>}
                        {page !== maxPage && <span className="blue-button" onClick={() => changePage(page+1)}>&gt;</span>}
                    </div>
            </form>
        </div>
        <AdminItemList items={items}/>
        </>
    );
};

export default AdminFilterForm;