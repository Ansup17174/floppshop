import {useState, useEffect} from 'react';



const App = () => {
  const [inputValue, setInputValue] = useState("");
  const [items, setItems] = useState([]);


  return (
    <div>
      <form>
        <input type="text"/>
        <input type="submit" value="Search items by name"/>
      </form>
    </div>
  );
};

export default App;
