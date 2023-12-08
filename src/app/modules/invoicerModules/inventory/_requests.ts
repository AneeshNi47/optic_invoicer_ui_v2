import axios from 'axios'
import {InventoryItem} from './_models'

const API_URL = process.env.REACT_APP_API_URL

export const GET_INVENTORY_ITEMS_URL = `${API_URL}/api/inventory`

// Server should return Inventory
export function getInventoryItems(token: string) {
  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Token ${token}`,
  }

  return axios.get<InventoryItem[]>(GET_INVENTORY_ITEMS_URL, {headers})
}
