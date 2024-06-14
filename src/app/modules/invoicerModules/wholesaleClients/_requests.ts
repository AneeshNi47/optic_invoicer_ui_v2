import axios from 'axios'
import {WholeSaleClient, AddWholeSaleClient, WholeSaleClients} from './_models'

const API_URL = process.env.REACT_APP_API_URL

export const GET_WHOLESALE_CLIENT_ITEMS_URL = `${API_URL}/api/wholesale-clients`

// Server should return Wholesale Client
export function getWholesaleClientItems(
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
    return axios.get<WholeSaleClients>(`${next}`, {headers})
  }
  return axios.get<WholeSaleClients>(`${GET_WHOLESALE_CLIENT_ITEMS_URL}/?page_size=${page}`, {
    headers,
  })
}

// Add Wholesale Client
export function addWholesaleClient(token: string, data: any) {
  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Token ${token}`,
  }

  return axios.post<AddWholeSaleClient[]>(`${GET_WHOLESALE_CLIENT_ITEMS_URL}/`, data, {
    headers,
  })
}
