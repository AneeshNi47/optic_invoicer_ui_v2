import {
  GET_PRESCRIPTIONS,
  DELETE_PRESCRIPTION,
  ADD_PRESCRIPTION,
  UPDATE_PRESCRIPTION,
} from "../actions/types";

const initialState = {
  prescriptions: [],
};

// eslint-disable-next-line import/no-anonymous-default-export
export default function (state = initialState, action) {
  switch (action.type) {
    case GET_PRESCRIPTIONS:
      return {
        ...state,
        prescriptions: action.payload,
      };
    case ADD_PRESCRIPTION:
      return {
        ...state,
        prescriptions: [...state.prescriptions, action.payload],
      };
    case UPDATE_PRESCRIPTION:
      let updatedPrescriptions = [...state.prescriptions];
      for (let i = 0; i < updatedPrescriptions.length; i++) {
        if (updatedPrescriptions[i].id === action.payload.id) {
          updatedPrescriptions[i] = action.payload;
          break;
        }
      }
      return {
        ...state,
        prescriptions: updatedPrescriptions,
      };
    case DELETE_PRESCRIPTION:
      return {
        ...state,
        prescriptions: state.prescriptions.filter(
          (invoice) => invoice.id !== action.payload
        ),
      };
    default:
      return state;
  }
}
