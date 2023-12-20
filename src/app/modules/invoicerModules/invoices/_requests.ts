import axios from 'axios'
import {InvoiceModel} from './_models'

const API_URL = process.env.REACT_APP_API_URL

export const GET_INVOICES_URL = `${API_URL}/api/invoice`
export const GET_CUSTOMER_URL = `${API_URL}/api/search_customer`

// Server should return InvoiceModel
export function getInvoices(token: string, next: string, page: number) {
  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Token ${token}`,
  }
  if(next) {
    return axios.get<InvoiceModel[]>(`${next}`, {headers})
  }
  return axios.get<InvoiceModel>(`${GET_INVOICES_URL}/?page_size=${page}`, {headers})
}

export function addInvoiceService(token:string, data: InvoiceModel) {
  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Token ${token}`,
  }

  return axios.post<InvoiceModel[]>(`${GET_INVOICES_URL}/create/`, data, { headers })
}

export function fetchSearchedCustomers(token: string, value: string) {
  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Token ${token}`,
  }
  return axios.get<any>(`${GET_CUSTOMER_URL}?phone=${value}`, {headers})
}
