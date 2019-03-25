import axios from "axios";
import {GET_CATEGORIES, GET_ERRORS, SET_CATEGORIES} from "./types";


export const getCategories = () => dispatch => {
    axios
        .get("/api/categories/all")
        .then(res => {
            dispatch({
                type: SET_CATEGORIES,
                payload: res.data
            });
        })
        .catch(err => {
            dispatch({
                type: GET_ERRORS,
                payload: err.response.data.message
            });
        });
};