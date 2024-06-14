export interface WholeSaleClients {
  next: string
  previous: string
  results: WholeSaleClient[]
}

export interface WholeSaleClient {
  id_no: string
  name: string
  address: string
  country: string
  tax_number: string
  tax_percentage: number
  phone: string
  email: string
  website: string
  contact_person: string
  contact_person_phone: string
  contact_person_email: string
  contact_person_designation: string
  total_orders: number
  total_credit: number
  total_payment: number
  last_payment_date: string | null
  last_order_date: string | null
  is_active: boolean
  created_by: string | null // Assuming created_by and updated_by are user IDs
  updated_by: string | null
  created_on: string
  updated_on: string
  organization: number
}

export interface AddWholeSaleClient {
  id_no: string
  name: string
  address: string
  country: string
  tax_number: string
  tax_percentage: number
  phone: string
  email: string
  website: string
  contact_person: string
  contact_person_phone: string
  contact_person_email: string
  contact_person_designation: string
}
