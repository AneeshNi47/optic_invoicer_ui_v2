import { REFETCH_INVENTORY } from "../actions/types";

const initialState = {
    shouldFetchInventory: false,
  };

// eslint-disable-next-line import/no-anonymous-default-export
export default function (state = initialState, action) {
  switch (action.type) {
    case REFETCH_INVENTORY:
        return { ...state, shouldFetchInventory: action.payload };
    default:
      return state;
  }
}