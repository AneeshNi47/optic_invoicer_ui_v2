export interface InventoryItems {
  next: string
  previous: string
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

type Prescription = {
  id: number
  customer: number
  left_sphere: number | null
  right_sphere: number | null
  left_cylinder: number | null
  right_cylinder: number | null
  left_axis: number | null
  right_axis: number | null
  left_prism: number | null
  right_prism: number | null
  left_add: number | null
  right_add: number | null
  left_ipd: number | null
  right_ipd: number | null
  pupillary_distance: number | null
  additional_notes: string | null
  is_active: boolean
  created_on: string
  updated_on: string
  created_by: number | null
  updated_by: number | null
}

export interface Invoice {
  id: string
  invoice_number: string
  date: string
  remarks: string
  delivery_date: string | null
  total: string
  discount: string
  advance: string
  advance_payment_mode: string
  tax_percentage: string
  balance: string
  status: string
  is_active: boolean
  is_taxable: boolean
  created_on: string
  updated_on: string
  customer: number
  prescription: number | null
  created_by: number | null
  updated_by: number | null
  organization: number
  items: any[] // Define the type for items if you have a specific structure
}

export interface Customer {
  id: number
  prescriptions: Prescription[]
  invoices: Invoice[]
  phone: string
  email: string
  first_name: string
  last_name: string
  theme_mode: string
  gender: string
  is_active: boolean
  created_on: string
  updated_on: string
  user: number | null
  created_by: number | null
  updated_by: number | null
}
