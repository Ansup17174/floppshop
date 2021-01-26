import Header from './components/Header';
import FilterForm from './components/FilterForm';
import NotFound from './components/NotFound';
import Register from './components/Register'
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
            <Route path="/register">
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