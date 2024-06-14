export interface WholeSaleInventoryItems {
  next: string
  previous: string
  results: WholeSaleInventoryItem[]
}

export interface WholeSaleInventoryItem {
  id: number
  item_code: string
  item_type: string
  item_property: string
  group: string
  category: string
  item_name: string
  description: string
  brand: string
  origin: string
  part_model_no: string
  size: string
  color: string
  basic_unit_of_measure: string
  std_cost: number
  selling_price_1: number
  selling_price_2: number
  selling_price_3: number
  re_order_qty: number
  min_price: number
  max_discount_percentage: number
  preferred_vendor: number | null // Assuming preferred_vendor is an ID of WholeSaleVendor
  vendor_ref_no: string
  created_by: string | null // Assuming created_by and updated_by are user IDs
  updated_by: string | null
  created_on: string
  updated_on: string
  organization: number
}

export interface AddWholeSaleInventoryItem {
  item_code: string
  item_type: string
  item_property: string
  group: string
  category: string
  item_name: string
  description: string
  brand: string
  origin: string
  part_model_no: string
  size: string
  color: string
  basic_unit_of_measure: string
  std_cost: number
  selling_price_1: number
  selling_price_2: number
  selling_price_3: number
  re_order_qty: number
  min_price: number
  max_discount_percentage: number
  preferred_vendor?: number | null // Optional in the add form
  vendor_ref_no: string
}
