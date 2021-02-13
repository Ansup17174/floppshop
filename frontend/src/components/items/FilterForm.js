import {useState, useEffect} from 'react';
import apiInstance from '../../utils/api';
import ItemList from './ItemList';
import './items.css';
import {FiChevronRight, FiChevronLeft} from 'react-icons/fi';

const FilterForm = () => {

    const [search, setSearch] = useState({
        text: "",
        minPrice: 0,
        maxPrice: 0,
        orderBy: ""
    });

    const [page, setPage] = useState(1);
    const [maxPage, setMaxPage] = useState(1);
    const [items, setItems] = useState([]);
    const [filterToggled, setFilterToggled] = useState(false);

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
        const url = `shop/items/?limit=10&offset=${(page-1)*10}`;
        let params = {
            search: search.text,
            min_price: search.minPrice,
            max_price: search.maxPrice,
            order_by: search.orderBy
        };
        apiInstance.get(url, {params})
        .then(response => {
            setItems(response.data.results);
            setMaxPage(Math.floor((response.data.count - 1) / 10) + 1);
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
        <div className={`filter${filterToggled ? "" : " not-displayed"}`}>
            <form className="filter-form" onSubmit={handleSubmit}>
                <div>
                    <h4>Filter by</h4>
                    <div>
                        <label htmlFor="searchText">Search by text:</label>
                        <input id="searchText" className="filter-form-input" type="text" maxLength="100" size="25" autoComplete="off" value={search.text} onChange={changeText}/>
                    </div>
                    <div>
                        <label htmlFor="min-price">Price:</label>
                        <input id="min-price" className="filter-form-input filter-form-number" type="number" size="2" min="0" value={search.minPrice} onChange={(changeMinPrice)}/>-
                        <input id="max-price" className="filter-form-input filter-form-number" type="number" size="2" min="0" value={search.maxPrice} onChange={changeMaxPrice}/>
                    </div>
                </div>
                <input className="filter-form-submit" type="submit" value="Filter" onClick={() => setFilterToggled(false)}/>
                <div>
                    <h4>Order by</h4>
                    <label>Price:</label>
                    <div>
                        <input type="radio" className="filter-form-radio" name="price" id="price1" value="+" onChange={e => setSearch({...search, orderBy: e.target.value})}/>
                        <label htmlFor="price1">Ascending</label>
                        <input type="radio" className="filter-form-radio" name="price" id="price2" value="-" onChange={e => setSearch({...search, orderBy: e.target.value})}/>
                        <label htmlFor="price2">Descending</label> 
                    </div>
                </div>
                <div className="not-displayed">
                    <div>
                    <h3>Page: <input type="number" className="filter-form-input filter-form-number" value={page} onFocus={e => e.target.select()} onBlur={e => changePage(e.target.value)}/> of {maxPage}</h3>
                    </div>
                    <div>
                        {page !== 1 && <span className="blue-button" onClick={() => changePage(page-1)}>&lt;</span>}
                        {page !== maxPage && <span className="blue-button" onClick={() => changePage(page+1)}>&gt;</span>}
                    </div>
                </div>
            </form>
        </div>
        <div className="filter-arrow" onClick={() => setFilterToggled(!filterToggled)}>{filterToggled ? <FiChevronLeft /> : <FiChevronRight />}</div>
        <div className="pages">
                <span className={`blue-button${page !== 1 ? "" : " hidden"}`} onClick={() => changePage(page-1)}>&lt;</span>
                <h4><input type="number" className="filter-form-input page-input" value={page} onFocus={e => e.target.select()} onChange={e => changePage(e.target.value)}/> of {maxPage}</h4>
                <span className={`blue-button${page !== maxPage ? "" : " hidden"}`} onClick={() => changePage(page+1)}>&gt;</span>
        </div>
        <ItemList items={items}/>
        </>
    );
};

export default FilterForm;