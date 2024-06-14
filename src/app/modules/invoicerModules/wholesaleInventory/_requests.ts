import axios from 'axios'
import {WholeSaleInventoryItems} from './_models'
import {AddWholeSaleInventoryItem} from './_models'

const API_URL = process.env.REACT_APP_API_URL

export const GET_WHOLESALE_INVENTORY_ITEMS_URL = `${API_URL}/api/wholesale-inventory`

// Server should return Wholesale Inventory
export function getWholesaleInventoryItems(
  token: string,
  next: string,
  page: number,
  initialLoad: boolean
) {
  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Token ${token}`,
  }
  if (next && !initialLoad) {
    return axios.get<WholeSaleInventoryItems>(`${next}`, {headers})
  }
  return axios.get<WholeSaleInventoryItems>(
    `${GET_WHOLESALE_INVENTORY_ITEMS_URL}/?page_size=${page}`,
    {
      headers,
    }
  )
}

// Add Inventory
export function addWholesaleInventory(token: string, data: any) {
  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Token ${token}`,
  }

  return axios.post<AddWholeSaleInventoryItem[]>(`${GET_WHOLESALE_INVENTORY_ITEMS_URL}/`, data, {
    headers,
  })
}
