import axios from 'axios'
// import {InventoryItems} from './_models'
// import { AddInventoryItem } from './_models'

const API_URL = process.env.REACT_APP_API_URL

export const GET_CUSTOMER_ITEMS_URL = `${API_URL}/api/customer`

// Server should return Inventory
export function getCustomerItems(token: string, next: string, page: number,
  phone: string | null) {
  const headers = {
    'Content-Type': 'application/json', 
    Authorization: `Token ${token}`,
  }
  let url: string;

  if (next) {
    url = next;
  } else {
    url = `${GET_CUSTOMER_ITEMS_URL}/?page_size=${page}`;
  }

  if (phone) {
    url += `&phone=${phone}`;
  }
  return axios.get<any>(url, { headers });
}

// Server should return Inventory
export function getCustomerObject(token: string, id: number) {
  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Token ${token}`,
  }
  return axios.get<any>(`${GET_CUSTOMER_ITEMS_URL}/${id}`, {headers})
}
