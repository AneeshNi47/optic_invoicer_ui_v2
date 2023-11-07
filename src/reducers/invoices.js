import {
  GET_INVOICES,
  DELETE_INVOICE,
  ADD_INVOICE,
  UPDATE_INVOICE,
} from "../actions/types";

const initialState = {
  invoices: [],
};

// eslint-disable-next-line import/no-anonymous-default-export
export default function (state = initialState, action) {
  switch (action.type) {
    case GET_INVOICES:
      return {
        ...state,
        invoices: action.payload,
      };
    case ADD_INVOICE:
      return {
        ...state,
        invoices: [...state.invoices, action.payload],
      };
    case UPDATE_INVOICE:
      let updatedLeads = [...state.invoices];
      for (let i = 0; i < updatedLeads.length; i++) {
        if (updatedLeads[i].id === action.payload.id) {
          updatedLeads[i] = action.payload;
          break;
        }
      }
      return {
        ...state,
        invoices: updatedLeads,
      };
    case DELETE_INVOICE:
      return {
        ...state,
        invoices: state.invoices.filter(
          (invoice) => invoice.id !== action.payload
        ),
      };
    default:
      return state;
  }
}
