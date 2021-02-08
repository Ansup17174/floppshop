import Header from './components/Header';
import FilterForm from './components/FilterForm';
import NotFound from './components/NotFound';
import Register from './components/Register';
import Login from './components/Login';
import Logout from './components/Logout';
import ConfirmEmail from './components/ConfirmEmail';
import UserProfile from './components/UserProfile'
import ChangePassword from './components/ChangePassword';
import UserContext from './context/UserContext';
import ItemDetails from './components/ItemDetails';
import ActiveOrder from './components/ActiveOrder';
import Checkout from './components/Checkout';
import History from './components/History';
import PasswordReset from './components/PasswordReset';
import {useState, useEffect} from 'react';
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';
import axios from 'axios';
import PasswordResetConfirm from './components/PasswordResetConfirm';
import AdminPanel from './components/AdminPanel';
import AdminFilterForm from './components/AdminFilterForm';
import AdminItemDetails from './components/AdminItemDetails';
import AdminEditItem from './components/AdminEditItem';
import AdminCreateItem from './components/AdminCreateItem';
import AdminDeleteItem from './components/AdminDeleteItem';


const App = () => {

  const [userData, setUserData] = useState({});

  const reloadUserData = async () => {
    const url = "http://localhost:8000/auth/user/";
    await axios.get(url, {withCredentials: true})
    .then(response => {
      setUserData(response.data);
    })
    .catch(error => {
      setUserData({});
    });
  };

  useEffect(() => {
    reloadUserData();
  }, []);

  return (
    <Router>
      <UserContext.Provider value={{userData, reloadUserData}}>
        <div className="nav-wrapper">
          <Header />
        </div>
        <div className="page">
        <Switch>
            <Route path="/" component={FilterForm} exact/>
            <Route path="/item-details/:id" component={ItemDetails} exact />
            <Route path="/order" component={ActiveOrder} exact />
            <Route path="/order-history" component={History} exact />
            <Route path="/checkout" component={Checkout} exact />
            <Route path="/verify-email/:key" component={ConfirmEmail} exact/>
            <Route path="/register" component={Register} exact/>
            <Route path="/login" component={Login} exact/>
            <Route path="/logout" component={Logout} exact/>
            <Route path="/profile" component={UserProfile} exact />
            <Route path="/change-password" component={ChangePassword} exact />
            <Route path="/reset-password" component={PasswordReset} exact />
            <Route path="/reset/:uid/:token/" component={PasswordResetConfirm} exact />
            <Route path="/admin-panel" component={AdminPanel} exact />
            <Route path="/admin-items" component={AdminFilterForm} exact />
            <Route path="/admin-item-details/:id" component={AdminItemDetails} exact />
            <Route path="/admin-item-create" component={AdminCreateItem} exact />
            <Route path="/admin-edit-item/:id" component={AdminEditItem} exact />
            <Route path="/admin-delete-item/:id" component={AdminDeleteItem} exact />
            <Route path="*" component={NotFound}/>
        </Switch>
        </div>
      </UserContext.Provider>
    </Router>
  );
};

export default App;