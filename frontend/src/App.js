import Header from './components/Header';
import FilterForm from './components/FilterForm';
import MainPage from './components/MainPage';

const App = () => {
  return (
    <div>
      <div className="nav-wrapper">
        <Header />
      </div>
      <div className="page">
        <FilterForm />
        <MainPage />
      </div>
    </div>
  );
};

export default App;