import { Switch } from 'react-router-dom';
import Home from './components/Home';
import Update from './components/Update';
import View from './components/View';
import Login from './components/Login';
import { Route } from 'react-router-dom';
import Check from './components/Check';
import { createStore } from 'redux';
import allReducers from './reducers/';
import { Provider } from 'react-redux';
import axios from 'axios';
import Register from './components/Register';


// Setting the base url of axios
// modify this if running on different domain
axios.defaults.baseURL = 'http://localhost:8000/api';

// creating redux store
// the second argument for createStore function is for redux extension. remove this if you don't have it 
const store = createStore(allReducers, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());

function App() {
  return (
    <Provider store={store}>
        <Switch>
        {/* All front end routes */}
          <Route path="/login" component={Login} exact />
          <Route path="/register" component={Register} exact />
          <Route path="/" component={Home} exact />
          <Route path="/check" component={Check} exact />
          <Route path="/view" component={View} exact />
          <Route path="/update/:id" component={Update} exact />
        </Switch>
    </Provider>
  );
}

export default App;
