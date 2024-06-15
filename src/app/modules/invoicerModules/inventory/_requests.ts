import axios from 'axios'
import {InventoryItems} from './_models'
import { AddInventoryItem,UpdateInventoryQty } from './_models'

const API_URL = process.env.REACT_APP_API_URL

export const GET_INVENTORY_ITEMS_URL = `${API_URL}/api/inventory`

// Server should return Inventory
export function getInventoryItems(token: string,next: string, page: number, initialLoad: boolean) {
  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Token ${token}`,
  }
  if(next && !initialLoad) {
    return axios.get<InventoryItems>(`${next}`, {headers})
  }else{

  return axios.get<InventoryItems>(`${GET_INVENTORY_ITEMS_URL}/?page_size=${page}`, {headers})
  }
}

// Add Inventory
export function addInventory(token: string, data: any) {
  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Token ${token}`,
  };

  return axios.post<AddInventoryItem[]>(`${GET_INVENTORY_ITEMS_URL}/`, data, { headers });
}

// update Inventory Qty
export function updateInventoryQty(token: string, inventory_id, data: any) {
  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Token ${token}`,
  };

  return axios.patch<UpdateInventoryQty[]>(`${GET_INVENTORY_ITEMS_URL}/${inventory_id}/`, data, { headers });
}
