import axios from 'axios'
import {InvoiceModel} from './_models'

const API_URL = process.env.REACT_APP_API_URL

export const GET_INVOICES_URL = `${API_URL}/api/invoice`

// Server should return InvoiceModel
export function getInvoices(token: string) {
  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Token ${token}`,
  }

  return axios.get<InvoiceModel[]>(GET_INVOICES_URL, {headers})
}
