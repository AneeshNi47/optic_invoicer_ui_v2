import {
  GET_ORGANIZATIONS,
  DELETE_ORGANIZATION,
  ADD_ORGANIZATION,
  UPDATE_ORGANIZATION,
  GET_USER_ORGANIZATION,
} from "../actions/types";

const initialState = {
  user_organization: {},
  organizations: [],
  organization_search_results: [],
};

// eslint-disable-next-line import/no-anonymous-default-export
export default function (state = initialState, action) {
  switch (action.type) {
    case GET_USER_ORGANIZATION:
      return {
        ...state,
        user_organization: action.payload,
      };
    case GET_ORGANIZATIONS:
      return {
        ...state,
        organizations: action.payload,
      };
    case ADD_ORGANIZATION:
      return {
        ...state,
        organizations: [...state.organizations, action.payload],
      };
    case UPDATE_ORGANIZATION:
      let updatedCustomers = [...state.organizations];
      for (let i = 0; i < updatedCustomers.length; i++) {
        if (updatedCustomers[i].id === action.payload.id) {
          updatedCustomers[i] = action.payload;
          break;
        }
      }
      return {
        ...state,
        organizations: updatedCustomers,
      };
    case DELETE_ORGANIZATION:
      return {
        ...state,
        organizations: state.organizations.filter(
          (invoice) => invoice.id !== action.payload
        ),
      };
    default:
      return state;
  }
}
