import Header from './components/Header';
import FilterForm from './components/FilterForm';
import NotFound from './components/NotFound';
import Register from './components/Register';
import Login from './components/Login';
import Logout from './components/Logout';
import ConfirmEmail from './components/ConfirmEmail';
import UserProfile from './components/UserProfile'
import UserContext from './context/UserContext';
import ItemDetails from './components/ItemDetails';
import ActiveOrder from './components/ActiveOrder';
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
            <Route path="/" component={FilterForm} exact/>
            <Route path="/item-details/:id" component={ItemDetails} exact />
            <Route path="/orders" component={ActiveOrder} exact />
            <Route path="/verify-email/:key" component={ConfirmEmail} exact/>
            <Route path="/register" component={Register} exact/>
            <Route path="/login" component={Login} exact/>
            <Route path="/logout" component={Logout} exact/>
            <Route path="/profile" component={UserProfile} exact />
            <Route path="*" component={NotFound}/>
        </Switch>
        </div>
      </UserContext.Provider>
    </Router>
  );
};

export default App;