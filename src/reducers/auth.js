import {
  USER_LOADED,
  USER_LOADING,
  AUTH_ERROR,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOGOUT_SUCCESS,
  REGISTER_FAIL,
  GET_USERS,
  REGISTER_SUCCESS,
  USER_ORGANIZATION,
} from "../actions/types";

const initialState = {
  organization: null,
  token: localStorage.getItem("token"),
  isAuthenticated: false,
  isLoading: false,
  user: null,
  users: [],
  user_type: null,
};

// eslint-disable-next-line import/no-anonymous-default-export
export default function (state = initialState, action) {
  switch (action.type) {
    case USER_ORGANIZATION:
      return {
        ...state,
        organization: action.payload,
      };
    case LOGIN_SUCCESS:
    case REGISTER_SUCCESS:
      localStorage.setItem("token", action.payload.token);
      var organization = null;
      var user_type = action.payload.user.user_type;
      if (user_type === "staff") {
        organization = action.payload.user.staff_details.organization;
      }
      if (user_type === "customer") {
        organization = action.payload.user.customer_details.organization;
      }

      return {
        ...state,
        ...action.payload,
        isAuthenticated: true,
        isLoading: false,
        user: action.payload.user,
        organization: organization,
        user_type: action.payload.user.user_type,
      };
    case USER_LOADING:
      return {
        ...state,
        isLoading: true,
      };
    case GET_USERS:
      return {
        ...state,
        users: action.payload,
      };
    case USER_LOADED:
      console.log(action.payload);
      return {
        ...state,
        isLoading: false,
        isAuthenticated: true,
        user: action.payload,
        user_type: action.payload.user_type,
      };
    case LOGOUT_SUCCESS:
    case AUTH_ERROR:
    case LOGIN_FAIL:
    case REGISTER_FAIL:
      localStorage.removeItem("token");
      return {
        ...state,
        user: null,
        token: null,
        isLoading: null,
        isAuthenticated: false,
        user_type: null,
      };
    default:
      return state;
  }
}
