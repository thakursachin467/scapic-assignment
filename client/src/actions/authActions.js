import axios from "axios";
import { GET_ERRORS, SET_CURRENT_USER } from "./types";
import setAuthToken from "../Utils/setAuthToken";
import jwt_decode from "jwt-decode";

//Register user
export const registerUser = (userData, history) => dispatch => {
    console.log(userData)
    axios
        .post("/api/auth/signup", userData)
        .then(res => {
            history.push("/login");
        })
        .catch(err => {
            dispatch({
                type: GET_ERRORS,
                payload: err.response.data.message
            });
        });
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