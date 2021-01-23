import axios from 'axios';
import {useState} from 'react';



const App = () => {
  const [inputValue, setInputValue] = useState("");
  const [items, setItems] = useState([]);

  const handleSubmit = e => {
    e.preventDefault();
    const url = `http://localhost:8000/shop/items/?search=${inputValue}`;
    axios.get(url)
    .then(response => {
      console.log(response.data);
    })
  };

  
  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input type="text" value={inputValue} onChange={e => setInputValue(e.target.value)}/>
        <input type="submit" value="Search items by name"/>
      </form>
    </div>
  );
};

export default App;
