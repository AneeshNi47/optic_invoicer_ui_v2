export interface WholesaleOrders {
  next: string
  previous: string
  results: WholesaleOrder[]
}

export interface WholesaleOrder {
  order_no: string
  order_date: string
  is_taxable: boolean
  client: number // Assuming the client is an object with the WholeSaleClient interface
  total_amount: number
  total_discount: number
  total_tax: number
  total_payment: number
  total_credit: number
  payment_due_date: string
  payment_status: string
  order_status: string
  remarks: string
  created_by: number | null // Assuming these are user IDs
  updated_by: number | null
  created_on: string
  updated_on: string
  organization: number
}

export interface AddWholesaleOrder {
  order_no: string
  order_date: string
  is_taxable: boolean
  client: number // Assuming the client is an object with the WholeSaleClient interface
  total_amount: number
  total_discount: number
  total_tax: number
  total_payment: number
  total_credit: number
  payment_due_date: string
  payment_status: string
  order_status: string
  remarks: string
}

export interface InventoryItem {
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
}

export interface OrderItem {
  id: number
  discount_percentage: string
  inventory_item: InventoryItem
  quantity: number
  selected_selling_price: string
  order: number
}

export interface WholesaleOrderDetail {
  id: number
  items: OrderItem[]
  order_no: string
  order_date: string
  is_taxable: boolean
  total_amount: string
  total_discount: string
  total_tax: string
  total_payment: string
  total_credit: string
  payment_due_date: string
  payment_status: number
  order_status: number
  remarks: string
  created_on: string
  updated_on: string
  client: number
  created_by: number
  updated_by: number | null
  organization: number
}
