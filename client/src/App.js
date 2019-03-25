import React, { Component } from 'react';
import './App.css';
import store from "./store";
import {BrowserRouter,Route} from 'react-router-dom';
import { Provider } from "react-redux";
import NavBar from './Components/Layouts/Navbar';
import Register from './Components/Auth/Register';
import  Login from './Components/Auth/Login';
import Category from './Components/Category/category';
import setAuthToken from "./Utils/setAuthToken";
import { setCurrentUser } from "./actions/authActions";
if (localStorage.jwttoken) {
    /**
     * ! set auth token header
     */
    setAuthToken(localStorage.jwttoken);
    const jwt= localStorage.getItem('jwttoken');
    store.dispatch(setCurrentUser(jwt));
}
class App extends Component {
  render() {
    return (
        <Provider store={store}>
        <BrowserRouter className="App">
         <NavBar/>
            <Route exact path="/signup" component={Register} />
            <Route exact path="/login" component={Login} />
            <Route exact path='/categories' component={Category}/>
        </BrowserRouter>
        </Provider>
    );
  }
}

export default App;
