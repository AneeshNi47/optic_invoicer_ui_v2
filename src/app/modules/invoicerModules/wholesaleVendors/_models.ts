export interface WholeSaleVendorItems {
  next: string
  previous: string
  results: WholeSaleVendorItem[]
}

export interface WholeSaleVendorItem {
  id: number
  name: string
  address: string
  phone: string
  email: string
  website: string
  contact_person: string
  contact_person_phone: string
  contact_person_email: string
  contact_person_designation: string
  created_by: string | null
  updated_by: string | null
  created_on: string
  updated_on: string
  organization: number
}

export interface AddWholeSaleVendorItem {
  name: string
  address: string
  phone: string
  email: string
  website: string
  contact_person: string
  contact_person_phone: string
  contact_person_email: string
  contact_person_designation: string
}
