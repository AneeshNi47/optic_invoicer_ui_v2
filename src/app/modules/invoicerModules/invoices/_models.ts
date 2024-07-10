export interface Customer {
  is_active: Customer
  id: number
  phone: string
  email: string
  first_name: string
  last_name: string
  theme_mode: string
  gender: string
  created_on: string
  updated_on: string
  user: null // Update with correct type if applicable
  created_by: null // Update with correct type if applicable
  updated_by: null // Update with correct type if applicable
  organization: number
}

export interface Prescription {
  id: number
  customer: number
  left_sphere: number
  right_sphere: number
  left_cylinder: number
  right_cylinder: number
  left_axis: number
  right_axis: number
  left_prism: number
  right_prism: number
  left_add: number
  right_add: number
  left_ipd: number
  right_ipd: number
  pupillary_distance: number
  additional_notes: string
  is_active: boolean
  created_on: string
  updated_on: string
  created_by: null // Update with correct type if applicable
  updated_by: null // Update with correct type if applicable
  organization: number
}

export interface InvoicePayment {
  id: string
  invoice_number: string
  amount: string
  payment_type: string
  payment_mode: string
  remarks: string | null
  is_active: boolean
  created_on: string
  updated_on: string
  invoice: string
  created_by: number
  updated_by: number | null
  organization: number
}

export interface InventoryItemDetails {
  id: number
  item_type: string
  SKU: string
  store_sku: string
  name: string
  description: string
  qty: number
  sale_value: string
  cost_value: string
  brand: string
  is_active: boolean
  status: string
  created_on: string
  updated_on: string
  created_by: number
  updated_by: number
  organization: number
}

export interface InventoryItem {
  invoice: string
  inventory_item: InventoryItemDetails
  sale_value: string
  cost_value: string
  quantity: number
}

export interface InvoiceModel {
  next: string
  previous: string
  results: Array<IndividualInvoice>
}

export interface IndividualInvoice {
  id: string
  customer: Customer
  prescription: Prescription
  invoice_payment: InvoicePayment[]
  inventory_items: Array<InventoryItem>
  invoice_number: string
  date: string
  remarks: string
  delivery_date: string
  total: any
  discount: string
  advance: string
  advance_payment_mode: string
  tax_percentage: string
  status: string
  balance: string

  is_active: boolean
  is_taxable: any
  created_on: string
  updated_on: string
  created_by: number
  updated_by: number | null
  organization: number
  items: any[] // Update with correct type if applicable
}

export interface SubscriptionResponse {
  subscription_id: number
  trial_start_date: string
  trial_end_date: string
  subscription_type: string
  create_invoice_permission: boolean
  status: string
  created_on: string
  payments: Payment[]
}

export interface Payment {
  payment_id: number
  amount: number
  payment_mode: string
  created_on: string
}
