import {
  GET_CUSTOMERS,
  DELETE_CUSTOMER,
  ADD_CUSTOMER,
  UPDATE_CUSTOMER,
  SEARCH_CUSTOMERS,
} from "../actions/types";

const initialState = {
  customers: [],
  customer_search_results: [],
};

// eslint-disable-next-line import/no-anonymous-default-export
export default function (state = initialState, action) {
  switch (action.type) {
    case GET_CUSTOMERS:
      return {
        ...state,
        customers: action.payload,
      };
    case ADD_CUSTOMER:
      return {
        ...state,
        customers: [...state.customers, action.payload],
      };
    case SEARCH_CUSTOMERS:
      let search_results = [];
      action.payload.map((result) =>
        search_results.push({
          key: result.id,
          value: result,
          title: `${result.first_name} ${result.phone}`,
          descriptions: `${result.first_name} ${result.phone}`,
          text: `${result.first_name} ${result.phone}`,
        })
      );
      return {
        ...state,
        customer_search_results: search_results,
      };
    case UPDATE_CUSTOMER:
      let updatedCustomers = [...state.customers];
      for (let i = 0; i < updatedCustomers.length; i++) {
        if (updatedCustomers[i].id === action.payload.id) {
          updatedCustomers[i] = action.payload;
          break;
        }
      }
      return {
        ...state,
        customers: updatedCustomers,
      };
    case DELETE_CUSTOMER:
      return {
        ...state,
        customers: state.customers.filter(
          (invoice) => invoice.id !== action.payload
        ),
      };
    default:
      return state;
  }
}
