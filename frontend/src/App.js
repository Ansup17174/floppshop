import Header from './components/Header';
import FilterForm from './components/FilterForm';
import MainPage from './components/MainPage';
import NotFound from './components/NotFound';
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';

const App = () => {
  return (
    <Router>
      <div>
        <div className="nav-wrapper">
          <Header />
        </div>
        <Switch>
          <Route path="/" exact>
          <div className="page">
              <FilterForm />
              <MainPage />
            </div>
          </Route>
          <Route path="*">
            <div className="page">
            <NotFound />
            </div>
          </Route>
        </Switch>
      </div>
    </Router>
  );
};

export default App;