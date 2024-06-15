import { Interface } from "readline"

export interface InventoryItems {
  next: string,
  previous: string,
  results: InventoryItem[]
  
}

export interface InventoryItem {
  
  id: number
  item_type: string
  SKU: string
  store_sku: string
  name: string
  description: string
  qty: number
  sale_value: number
  cost_value: number
  brand: string
  is_active: boolean
  status: string
  created_on: string
  updated_on: string
  created_by: string
  updated_by: string
  organization: number
  
}

export interface AddInventoryItem {
  item_type: string
  store_sku: string
  name: string
  description: string
  qty: number
  sale_value: number
  cost_value: number
  brand: string
}

export interface UpdateInventoryQty {
  qty: number

}