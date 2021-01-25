import {useState} from 'react';
import axios from 'axios';


const FilterForm = () => {

    const [state, setState] = useState({
        text: "",
        minPrice: 0,
        maxPrice: 0,
        isDiscount: false,
        orderBy: ""
    });

    const changeText = e => {
        setState({...state, text: e.target.value})
    };

    const changeMinPrice = e => {
        setState({...state, minPrice: e.target.value})
    };

    const changeMaxPrice = e => {
        setState({...state, maxPrice: e.target.value})
    };

    const changeIsDiscount = e => {
        setState({...state, isDiscount: !state.isDiscount})
    };

    const changeOrderBy = e => {
        setState({...state, orderBy: e.target.value})
    };

    const handleSubmit = e => {
        e.preventDefault();
        const url = `
            http://localhost:8000/shop/items/?search=${state.text}&min_price=${state.minPrice}&max_price${state.maxPrice}
        `
        axios.get(url)
        .then(response => {
            console.log(response.data);
            console.log(response.status);
        })
        .catch(error => {
            console.log(error.response);
            console.log(error.status);
        });
    };

    return (
        <div className="filter">
            <form className="filter-form" onSubmit={handleSubmit}>
                <div>
                    <h4>Filter by</h4>
                    <div>
                        <label htmlFor="searchText">Search by text:</label>
                        <input id="searchText" type="text" maxLength="100" size="10" autoComplete="off" value={state.text} onChange={changeText}/>
                    </div>
                    <div>
                        <label htmlFor="min-price">Price:</label>
                        <input id="min-price" type="number" size="2" min="0" value={state.minPrice} onChange={changeMinPrice}/>-
                        <input id="max-price" type="number" size="2" min="0" value={state.maxPrice} onChange={changeMaxPrice}/>
                    </div>
                    <div>
                        <input type="checkbox" id="is-discount" checked={state.isDiscount} onChange={changeIsDiscount}/>
                        <label htmlFor="is-discount">On discount</label>
                    </div>
                </div>
                <div>
                    <h4>Order by</h4>
                    <label>Price:</label>
                    <div>
                        <input type="radio" name="price" id="price1" value="ascending" onChange={changeOrderBy}/>
                        <label htmlFor="price1">Ascending</label>
                        <input type="radio" name="price" id="price2" value="descending" onChange={changeOrderBy}/>
                        <label htmlFor="price2">Descending</label> 
                    </div>
                </div>
                <input className="submit-button" type="submit" value="Filter"/>
            </form> 
        </div>
    );
};

export default FilterForm;