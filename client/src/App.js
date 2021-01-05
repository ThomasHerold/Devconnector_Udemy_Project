import React, { useEffect } from 'react';
import Navbar from './components/layouts/Navbar';
import Landing from './components/layouts/Landing';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Routes from './components/routing/Routes';
import './App.css';
import { loadUser } from './actions/auth';
import setAuthToken from './utils/setAuthToken';


// Redux 
import { Provider } from 'react-redux';
import store from './store';


if (localStorage.token) {
  setAuthToken(localStorage.token);
}

// Attempt to load user on App load only once
const App = () => {
  useEffect(() =>{
    store.dispatch(loadUser());
  }, []);

 return (
   <Provider store={store}>
   <Router>
      <Navbar />
      <Switch>
        <Route exact path="/" component={Landing} />
        <Route component={Routes}/>
      </Switch>
   </Router>
   </Provider>
 );
};

export default App;
