import axios from 'axios'
import {WholesaleOrder, WholesaleOrderDetail, AddWholesaleOrder} from './_models'
import {GET_WHOLESALE_INVENTORY_ITEMS_URL} from '../wholesaleInventory/_requests'

const API_URL = process.env.REACT_APP_API_URL

export const WHOLESALE_ORDERS_URL = `${API_URL}/api/wholesale-orders/`

// Server should return WholesaleOrders
export function getWholesaleOrders(
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
    return axios.get<WholesaleOrder[]>(`${next}`, {headers})
  }
  return axios.get<WholesaleOrder>(`${WHOLESALE_ORDERS_URL}/?page_size=${page}`, {headers})
}

// Server should return WholesaleOrderObject
export function getWholesaleOrderObject(token: string, id: string) {
  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Token ${token}`,
  }
  return axios.get<WholesaleOrderDetail>(`${WHOLESALE_ORDERS_URL}/${id}`, {headers})
}

export function addWholesaleOrder(token: string, data: AddWholesaleOrder) {
  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Token ${token}`,
  }

  return axios.post<AddWholesaleOrder[]>(`${WHOLESALE_ORDERS_URL}/`, data, {headers})
}

// export function fetchSearchedCustomers(token: string, value: string, selectCustomerBy: string) {
//   const headers = {
//     'Content-Type': 'application/json',
//     Authorization: `Token ${token}`,
//   }
//   return axios.get<any>(`${GET_CUSTOMER_URL}?${selectCustomerBy}=${value}`, {headers})
// }

export function fetchSearchedInventory(token: string, value: string, searchInventoryBy: string) {
  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Token ${token}`,
  }
  return axios.get<any>(`${GET_WHOLESALE_INVENTORY_ITEMS_URL}?${searchInventoryBy}=${value}`, {
    headers,
  })
}

// export function invoicePayment(token: string, data: any) {
//   const headers = {
//     'Content-Type': 'application/json',
//     Authorization: `Token ${token}`,
//   }
//   return axios.post<any>(`${POST_PAYMENT_URL}/`, data, {headers})
// }

// export function generateInvoicePDF(token: string, value) {
//   return axios.get<any>(`${FILE_DOWNLOAD_URL}${value}`, {
//     headers: {
//       'Content-Type': 'application/json',
//       Authorization: `Token ${token}`,
//     },
//     responseType: 'blob',
//   })
// }

// export const printInvoice = (token, invoice_id) => {
//   return async (dispatch) => {
//     return new Promise((resolve, reject) => {
//       axios
//         .get(`${FILE_DOWNLOAD_URL}${invoice_id}`, {
//           headers: {
//             'Content-Type': 'application/json',
//             Authorization: `Token ${token}`,
//           },
//           responseType: 'blob',
//         })
//         .then((res) => {
//           const blob = new Blob([res.data], {type: 'application/pdf'})
//           const url = window.URL.createObjectURL(blob)
//           const link = document.createElement('a')
//           link.href = url
//           link.setAttribute('download', `${invoice_id}.pdf`)
//           document.body.appendChild(link)
//           link.click()
//           resolve(blob)
//         })
//         .catch((err) => {
//           dispatch(err.response.data, err.response.status)
//           reject() // Reject the promise in case of an error
//         })
//     })
//   }
// }
