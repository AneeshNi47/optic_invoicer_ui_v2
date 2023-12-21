import axios from 'axios'
import {InventoryItems} from './_models'
import { AddInventoryItem } from './_models'

const API_URL = process.env.REACT_APP_API_URL

export const GET_INVENTORY_ITEMS_URL = `${API_URL}/api/inventory`

// Server should return Inventory
export function getInventoryItems(token: string,next: string, page: number) {
  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Token ${token}`,
  }
  if(next) {
    return axios.get<InventoryItems>(`${next}`, {headers})
  }
  return axios.get<InventoryItems>(`${GET_INVENTORY_ITEMS_URL}/?page_size=${page}`, {headers})
}

// Add Inventory
export function addInventory(token: string, data: any) {
  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Token ${token}`,
  };

  return axios.post<AddInventoryItem[]>(`${GET_INVENTORY_ITEMS_URL}/`, data, { headers });
}
