import Header from './components/Header';
import FilterForm from './components/items/FilterForm';
import NotFound from './components/NotFound';
import Register from './components/user/Register';
import Login from './components/user/Login';
import Logout from './components/user/Logout';
import ConfirmEmail from './components/user/ConfirmEmail';
import UserProfile from './components/user/UserProfile'
import ChangePassword from './components/user/ChangePassword';
import UserContext from './context/UserContext';
import ItemDetails from './components/items/ItemDetails';
import ActiveOrder from './components/order/ActiveOrder';
import Checkout from './components/order/Checkout';
import History from './components/order/History';
import PasswordReset from './components/user/PasswordReset';
import {useState, useEffect} from 'react';
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';
import apiInstance from './utils/api';
import PasswordResetConfirm from './components/user/PasswordResetConfirm';
import AdminPanel from './components/admin/AdminPanel';
import AdminFilterForm from './components/admin/AdminFilterForm';
import AdminItemDetails from './components/admin/AdminItemDetails';
import AdminEditItem from './components/admin/AdminEditItem';
import AdminCreateItem from './components/admin/AdminCreateItem';
import AdminDeleteItem from './components/admin/AdminDeleteItem';
import AdminEditImages from './components/admin/AdminEditImages';
import AdminCreateShipping from './components/admin/AdminCreateShipping';
import AdminShippingList from './components/admin/AdminShippingList';
import AdminEditShipping from './components/admin/AdminEditShipping';
import AdminNotifications from './components/admin/AdminNotifications';

const App = () => {

  const [userData, setUserData] = useState({});

  const reloadUserData = async () => {
    const token = localStorage.getItem("floppauth");
    if (token === null) {
      setUserData({});
    } else {
      await apiInstance.get('auth/user/', {withCredentials: true, headers: {"Authorization": `Bearer ${token}`}})
    .then(response => {
      setUserData(response.data);
    })
    .catch(error => {
      setUserData({});
      localStorage.removeItem("floppauth");
    });
    }
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
            <Route path="/admin-edit-item-images/:id" component={AdminEditImages} exact />
            <Route path="/admin-delete-item/:id" component={AdminDeleteItem} exact />
            <Route path="/admin-create-shipping" component={AdminCreateShipping} exact />
            <Route path="/admin-edit-shipping/:id" component={AdminEditShipping} exact />
            <Route path="/admin-shippings" component={AdminShippingList} exact />
            <Route path="/admin-notification-list" component={AdminNotifications} exact />
            <Route path="*" component={NotFound}/>
        </Switch>
        </div>
      </UserContext.Provider>
    </Router>
  );
};

export default App;