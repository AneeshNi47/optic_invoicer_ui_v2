import axios from "axios";
import {
  REGISTER_SUCCESS,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOGOUT_SUCCESS,
  USER_LOADING,
  USER_LOADED,
  AUTH_ERROR,
  REGISTER_FAIL,
  GET_USERS,
  GET_USER_ORGANIZATION,
} from "./types";
import { returnErrors } from "./messages";
import { getOrganization } from "./other_operations";
import { BASE_URL } from "./types";

export const loadUser = () => (dispatch, getState) => {
  dispatch({ type: USER_LOADING });
  axios
    .get(`${BASE_URL}/api/auth/user`, tokenConfig(getState))
    .then((res) => {
      dispatch({
        type: USER_LOADED,
        payload: res.data,
      });
    })
    .catch((err) => {
      dispatch(returnErrors(err.response.data, err.response.status));
      dispatch({
        type: AUTH_ERROR,
      });
    });
};

export const get_users = () => (dispatch, getState) => {
  axios
    .get(`${BASE_URL}/api/auth/non_super_users`, tokenConfig(getState))
    .then((res) => {
      dispatch({
        type: GET_USERS,
        payload: res.data,
      });
    })
    .catch((err) => {
      dispatch(returnErrors(err.response.data, err.response.status));
      dispatch({
        type: AUTH_ERROR,
      });
    });
};

export const registerUser =
  ({ username, email, password }) =>
  (dispatch) => {
    const body = JSON.stringify({
      username,
      password,
      email,
    });
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    axios
      .post(`${BASE_URL}/api/auth/register`, body, config)
      .then((res) => {
        dispatch({
          type: REGISTER_SUCCESS,
          payload: res.data,
        });
      })
      .catch((err) => {
        dispatch(returnErrors(err.response.data, err.response.status));
        dispatch({
          type: REGISTER_FAIL,
        });
      });
  };

export const loginUser = (username, password) => (dispatch) => {
  const body = JSON.stringify({
    username,
    password,
  });
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };
  axios
    .post(`${BASE_URL}/api/auth/login`, body, config)
    .then((res) => {
      dispatch({
        type: LOGIN_SUCCESS,
        payload: res.data,
      });
    })
    .catch((err) => {
      dispatch(returnErrors(err.response.data, err.response.status));
      dispatch({
        type: LOGIN_FAIL,
      });
    });
};

export const logoutUser = () => (dispatch, getState) => {
  axios
    .post(`${BASE_URL}/api/auth/logout`, null, tokenConfig(getState))
    .then((res) => {
      dispatch({
        type: LOGOUT_SUCCESS,
      });
    })
    .catch((err) => {
      dispatch(returnErrors(err.response.data, err.response.status));
    });
};

export const tokenConfig = (getState) => {
  const token = getState().authReducer.token;
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };
  if (token) {
    config.headers["Authorization"] = `Token ${token}`;
  }
  return config;
};
