import Header from './components/Header';
import FilterForm from './components/FilterForm';
import NotFound from './components/NotFound';
import Register from './components/Register';
import Login from './components/Login';
import ConfirmEmail from './components/ConfirmEmail';
import UserContext from './context/UserContext';
import {useState, useEffect} from 'react';
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';
import axios from 'axios';

const App = () => {

  const [userData, setUserData] = useState({});

  useEffect(() => {
    const url = "http://localhost:8000/auth/user/";
    axios.get(url, {withCredentials: true})
    .then(response => {
      setUserData(response.data);
    })
    .catch(error => {
      setUserData({});  
    })
  }, []);

  return (
    <Router>
      <UserContext.Provider value={{userData, setUserData}}>
        <div className="nav-wrapper">
          <Header />
        </div>
        <div className="page">
        <Switch>
            <Route path="/" exact>
              <FilterForm />
            </Route>
            <Route path="/verify-email/:key" exact>
              <ConfirmEmail />
            </Route>
            <Route path="/register" exact>
              <Register />
            </Route>
            <Route path="/login" exact>
              <Login />
            </Route>
            <Route path="*">
              <NotFound />
            </Route>
        </Switch>
        </div>
      </UserContext.Provider>
    </Router>
  );
};

export default App;