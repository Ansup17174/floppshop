import axios from 'axios';
import {useState, useEffect} from 'react';



const App = () => {
  const [inputValue, setInputValue] = useState("");
  const [items, setItems] = useState([]);

  const handleSubmit = e => {
    e.preventDefault();
    const url = `http://localhost:8000/shop/items/?search=${inputValue}`;
    axios.get(url)
    .then(response => {
      setItems(response.data);
    })
    .catch(error => {
      console.log(error.response);
      console.log(error.status);
    })
  };

  // useEffect(() => {
  //   if (items.legth) {

  //   }
  // }, [items]);

  
  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input type="text" value={inputValue} onChange={e => setInputValue(e.target.value)}/>
        <input type="submit" value="Search items by name"/>
      </form>
      <div>
        {items.map(item => (
          <div key={item.id}>
            <h3>Name: {item.name}</h3>
            <h3>Price: {item.price}</h3>
            <h3>Description: {item.description}</h3>
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;
