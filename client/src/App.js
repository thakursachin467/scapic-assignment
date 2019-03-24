import React, { Component } from 'react';
import './App.css';
import store from "./store";
import {BrowserRouter,Route,Switch,Redirect} from 'react-router-dom';
import { Provider } from "react-redux";
import NavBar from './Components/Layouts/Navbar';
import Register from './Components/Auth/Register';
import  Login from './Components/Auth/Login';
import jwt_decode from "jwt-decode";
import setAuthToken from "./Utils/setAuthToken";
import { setCurrentUser, logoutUser } from "./actions/authActions";

if (localStorage.jwttoken) {
    /**
     * ! set auth token header
     */
    setAuthToken(localStorage.jwttoken);
}
class App extends Component {
  render() {
    return (
        <Provider store={store}>
        <BrowserRouter className="App">
         <NavBar/>
            <Route exact path="/signup" component={Register} />
            <Route exact path="/login" component={Login} />
        </BrowserRouter>
        </Provider>
    );
  }
}

export default App;
