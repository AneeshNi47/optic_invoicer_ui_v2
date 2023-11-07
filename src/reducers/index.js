import { combineReducers } from "redux";
import invoices from "./invoices";
import errors from "./errors";
import messages from "./messages";
import auth from "./auth";
import customer from "./customer";
import prescription from "./prescription";
import inventory from "./inventory";
import organization from "./organization";

export default combineReducers({
  invoiceReducer: invoices,
  errorReducer: errors,
  messageReducer: messages,
  authReducer: auth,
  customerReducer: customer,
  inventoryReducer: inventory,
  prescriptionReducer: prescription,
  organizationReducer: organization,
});
