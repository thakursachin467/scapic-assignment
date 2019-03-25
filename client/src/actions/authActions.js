import axios from "axios";
import { GET_ERRORS, SET_CURRENT_USER } from "./types";
import setAuthToken from "../Utils/setAuthToken";

//Register user
export const registerUser = (userData, history) => dispatch => {
    axios
        .post("/api/auth/signup", userData)
        .then(res => {
            if(res.data.success){
                history.push("/login");
            }
        })
        .catch(err => {
            dispatch({
                type: GET_ERRORS,
                payload: err.response.data.message
            });
        });
};

export const googleOauth = ()=>{
        axios
            .get("/api/auth/google")
};

export const facebookOauth = ()=>{
    axios
        .get("/api/auth/facebook")

};

//Login user
export const loginuser = (userData, history) => dispatch => {
    axios
        .post("/api/auth/login", userData)
        .then(res => {
            //save token to local storage
            const { token } = res.data.body;
            //set token local storage
            localStorage.setItem("jwttoken", token);
            /**
             * * set auth token to header
             */
            setAuthToken(token);
            dispatch(setCurrentUser(token))
        })
        .catch(err => {
            dispatch({
                type: GET_ERRORS,
                payload: err.response.data.message
            });
        });
};


/**
 * ! Logout action
 */

export const logoutUser = () => dispatch => {
    //remove token from local sstorage
    localStorage.removeItem("jwttoken");
    /**
     * ! remove  auth header for future request
     */

    setAuthToken(false);
    //set current user to empy user
};


/**
 * Set current user
 */

export  const setCurrentUser= (jwt) =>{
  return {
      type: SET_CURRENT_USER,
      payload: jwt
  }
};