import axios from 'axios'
// import {InventoryItems} from './_models'
// import { AddInventoryItem } from './_models'

const API_URL = process.env.REACT_APP_API_URL

export const GET_CUSTOMER_ITEMS_URL = `${API_URL}/api/customer`

// Server should return Inventory
export function getCustomerItems(token: string, next: string, page: number) {
  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Token ${token}`,
  }
  if (next) {
    return axios.get<any>(`${next}`, {headers})
  }
  return axios.get<any>(`${GET_CUSTOMER_ITEMS_URL}/?page_size=${page}`, {headers})
}

// Server should return Inventory
export function getCustomerObject(token: string, id: number) {
  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Token ${token}`,
  }
  console.log('getting custmoers')
  return axios.get<any>(`${GET_CUSTOMER_ITEMS_URL}/${id}`, {headers})
}
