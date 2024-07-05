import axios from 'axios'
import {InventoryItems} from './_models'
import { AddInventoryItem,UpdateInventoryQty } from './_models'

const API_URL = process.env.REACT_APP_API_URL

export const GET_INVENTORY_ITEMS_URL = `${API_URL}/api/inventory`

export function getInventoryItems(
  token: string,
  next: string | null,
  page: number,
  initialLoad: boolean,
  phone: string | null
) {
  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Token ${token}`,
  };

  let url: string;

  if (next && !initialLoad) {
    url = next;
  } else {
    url = `${GET_INVENTORY_ITEMS_URL}/?page_size=${page}`;
    if (phone) {
      url += `&phone=${phone}`;
    }
  }

  return axios.get<InventoryItems>(url, { headers });
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


// search Inventory Qty
export function searchInventory(token: string, inventory_id, data: any) {
  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Token ${token}`,
  };

  return axios.patch<UpdateInventoryQty[]>(`${GET_INVENTORY_ITEMS_URL}/${inventory_id}/`, data, { headers });
}
