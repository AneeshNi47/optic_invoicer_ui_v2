import axios from "axios";
import { createMessage, returnErrors } from "./messages";
import { tokenConfig } from "./auth";
import { BASE_URL } from "./types";

export const printInvoice = (modelName, invoice_id, invoice_number) => {
  return async (dispatch, getState) => {
    return new Promise((resolve, reject) => {
      axios
        .get(`${BASE_URL}/api/${modelName}/pdf/${invoice_id}`, {
          ...tokenConfig(getState),
          responseType: "blob",
        })
        .then((res) => {
          const blob = new Blob([res.data], { type: "image/png" });
          const url = window.URL.createObjectURL(blob);
          const link = document.createElement("a");
          link.href = url;
          link.setAttribute("download", `${invoice_number}.pdf`);
          document.body.appendChild(link);
          link.click();
          resolve();
        })
        .catch((err) =>
          dispatch(returnErrors(err.response.data, err.response.status))
        );
    });
  };
};

export const getOrganization =
  (modelName, actionType) => (dispatch, getState) => {
    axios
      .get(`${BASE_URL}/api/${modelName}`, tokenConfig(getState))
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

export const deactivateOrganization =
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
