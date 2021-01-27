import Header from './components/Header';
import FilterForm from './components/FilterForm';
import NotFound from './components/NotFound';
import Register from './components/Register';
import ConfirmEmail from './components/ConfirmEmail';
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';

const App = () => {
  return (
    <Router>
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
            <Route path="*">
              <NotFound />
            </Route>
        </Switch>
        </div>
    </Router>
  );
};

export default App;