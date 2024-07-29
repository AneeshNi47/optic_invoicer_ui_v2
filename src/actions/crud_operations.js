import axios from "axios";
import { GET_ERRORS, USER_ORGANIZATION } from "./types";
import { createMessage, returnErrors } from "./messages";
import { tokenConfig } from "./auth";
import { BASE_URL } from "./types";

export const getItems = (modelName, actionType) => (dispatch, getState) => {
  axios
    .get(`${BASE_URL}/api/${modelName}/`, tokenConfig(getState))
    .then((res) => {
      dispatch({
        type: actionType,
        payload: res.data,
      });
    })
    .catch((err) =>
      dispatch(returnErrors(err.response.data, err.response.status))
    );
};

export const searchItems =
  (modelName, searchKey, searchValue, actionType) => (dispatch, getState) => {
    axios
      .get(
        `${BASE_URL}/api/${modelName}?${searchKey}=${searchValue}`,
        tokenConfig(getState)
      )
      .then((res) => {
        dispatch({
          type: actionType,
          payload: res.data,
        });
      })
      .catch((err) =>
        dispatch(returnErrors(err.response.data, err.response.status))
      );
  };

export const deleteItem =
  (modelName, actionType, id) => (dispatch, getState) => {
    axios
      .delete(`${BASE_URL}/api/${modelName}/${id}/`, tokenConfig(getState))
      .then((res) => {
        dispatch(
          createMessage({ itemDeleted: `${modelName} Successfully Deleted` })
        );
        dispatch({
          type: actionType,
          payload: id,
        });
      })
      .catch((err) => {
        const errors = {
          msg: err.response.data,
          status: err.response.status,
        };
        dispatch({
          type: GET_ERRORS,
          payload: errors,
        });
      });
  };

export const addItem =
  (modelName, actionType, item) => (dispatch, getState) => {
    axios
      .post(`${BASE_URL}/api/${modelName}/`, item, tokenConfig(getState))
      .then((res) => {
        dispatch(
          createMessage({ itemAdded: `${modelName} Successfully Added` })
        );
        dispatch({
          type: actionType,
          payload: res.data,
        });
      })
      .catch((err) =>
        dispatch(returnErrors(err.response.data, err.response.status))
      );
  };

export const updateItem =
  (modelName, actionType, itemId, item) => (dispatch, getState) => {
    axios
      .put(
        `${BASE_URL}/api/${modelName}/${itemId}/`,
        item,
        tokenConfig(getState)
      )
      .then((res) => {
        dispatch(
          createMessage({ itemUpdated: `${modelName} Successfully Updated` })
        );
        dispatch({
          type: actionType,
          payload: res.data,
        });
      })
      .catch((err) =>
        dispatch(returnErrors(err.response.data, err.response.status))
      );
  };

export const get_organization = () => (dispatch, getState) => {
  axios
    .get(`${BASE_URL}/api/get_organization`, tokenConfig(getState))
    .then((res) => {
      dispatch({
        type: USER_ORGANIZATION,
        payload: res.data,
      });
    })
    .catch((err) =>
      dispatch(returnErrors(err.response.data, err.response.status))
    );
};
