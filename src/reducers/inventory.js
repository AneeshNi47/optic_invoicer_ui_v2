import {
  GET_ITEMS,
  DELETE_ITEM,
  ADD_ITEM,
  UPDATE_ITEM,
  SEARCH_INVENTORY,
} from "../actions/types";

const initialState = {
  items: [],
  item_search_results: [],
};

// eslint-disable-next-line import/no-anonymous-default-export
export default function (state = initialState, action) {
  switch (action.type) {
    case GET_ITEMS:
      return {
        ...state,
        items: action.payload,
      };
    case SEARCH_INVENTORY:
      let search_results = [];
      action.payload.map((result) =>
        search_results.push({
          key: result.id,
          value: result,
          title: `${result.name} ${result.description}`,
          descriptions: `${result.first_name} ${result.phone}`,
          text: `${result.first_name} ${result.phone}`,
        })
      );
      return {
        ...state,
        item_search_results: search_results,
      };
    case ADD_ITEM:
      return {
        ...state,
        items: [...state.items, action.payload],
      };
    case UPDATE_ITEM:
      let updatedItems = [...state.items];
      for (let i = 0; i < updatedItems.length; i++) {
        if (updatedItems[i].id === action.payload.id) {
          updatedItems[i] = action.payload;
          break;
        }
      }
      return {
        ...state,
        items: updatedItems,
      };
    case DELETE_ITEM:
      return {
        ...state,
        items: state.items.filter((invoice) => invoice.id !== action.payload),
      };
    default:
      return state;
  }
}
