import axios from 'axios'
import {WholeSaleVendorItems} from './_models'
import {AddWholeSaleVendorItem} from './_models'

const API_URL = process.env.REACT_APP_API_URL

export const GET_WHOLESALE_VENDOR_ITEMS_URL = `${API_URL}/api/wholesale-vendors`

// Server should return Wholesale Vendors
export function getWholesaleVendorItems(
  token: string,
  next: string,
  page: number,
  initialLoad: boolean
) {
  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Token ${token}`,
  }
  if (next && !initialLoad) {
    return axios.get<WholeSaleVendorItems>(`${next}`, {headers})
  }
  return axios.get<WholeSaleVendorItems>(`${GET_WHOLESALE_VENDOR_ITEMS_URL}/?page_size=${page}`, {
    headers,
  })
}

// Add Wholesale Vendor
export function addWholesaleVendor(token: string, data: any) {
  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Token ${token}`,
  }

  return axios.post<AddWholeSaleVendorItem[]>(`${GET_WHOLESALE_VENDOR_ITEMS_URL}/`, data, {
    headers,
  })
}
