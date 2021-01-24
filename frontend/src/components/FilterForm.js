


const FilterForm = () => {
    return (
        <div className="filter">
            <form className="filter-form">
                <div>
                    <h4>Filter by</h4>
                    <div>
                        <label htmlFor="searchText">Search by text:</label>
                        <input id="searchText" type="text" maxLength="100" size="10"/>
                    </div>
                    <div>
                        <label htmlFor="min-price">Price:</label>
                        <input id="min-price" type="number" size="2" min="0"/>-
                        <input id="max-price" type="number" size="2" min="0"/>
                    </div>
                    <div>
                        <input type="checkbox" id="is-discount" value="true"/>
                        <label htmlFor="is-discount">On discount</label>
                    </div>
                </div>
                <div>
                    <h4>Order by</h4>
                    <label>Price:</label>
                    <div>
                        <input type="radio" name="price" id="price1" value="asc"/>
                        <label htmlFor="price1">Ascending</label>
                        <input type="radio" name="price" id="price2" value="desc"/>
                        <label htmlFor="price2">Descending</label> 
                    </div>
                </div>
            </form>
        </div>
    );
};

export default FilterForm;