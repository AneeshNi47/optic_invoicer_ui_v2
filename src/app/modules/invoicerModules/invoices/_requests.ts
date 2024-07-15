import axios from 'axios'
import {InvoiceModel, IndividualInvoice, SubscriptionResponse} from './_models'

const API_URL = process.env.REACT_APP_API_URL

export const GET_INVOICES_URL = `${API_URL}/api/invoice`
export const GET_CUSTOMER_URL = `${API_URL}/api/search_customer`
export const GET_INVENTORY_URL = `${API_URL}/api/search_inventory`
export const POST_PAYMENT_URL = `${API_URL}/api/invoice-payment`
export const CUSTOMER_FILE_DOWNLOAD_URL = `${API_URL}/api/invoice/customer-pdf/`
export const FILE_DOWNLOAD_URL = `${API_URL}/api/invoice/pdf/`
export const CHECK_SUBSCRIPTION_URL = `${API_URL}/api/subscription_check`

// Server should return InvoiceModel
export function checkSubscription(token: string) {
  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Token ${token}`,
  }
  return axios.get<SubscriptionResponse>(`${CHECK_SUBSCRIPTION_URL}`, {headers})
}

export function getInvoices(
  token: string,
  next: string | null,
  page: number,
  initialLoad: boolean,
  phone: string | null
) {
  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Token ${token}`,
  };

  let url: string;

  if (next && !initialLoad) {
    url = next;
  } else {
    url = `${GET_INVOICES_URL}/?page_size=${page}`;
  }

  if (phone) {
    url += `&phone=${phone}`;
  }
  return axios.get<InvoiceModel>(url, { headers });
}

// Server should return InvoiceModel
export function searchInvoice(token: string, next: string, page: number, initialLoad: boolean) {
  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Token ${token}`,
  }
  if (next && !initialLoad) {
    return axios.get<InvoiceModel[]>(`${next}`, {headers})
  }else{

    return axios.get<InvoiceModel>(`${GET_INVOICES_URL}/?page_size=${page}`, {headers})
  }
}

// Server should return InvoiceModelObject
export function getInvoiceObject(token: string, id: string) {
  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Token ${token}`,
  }
  return axios.get<IndividualInvoice>(`${GET_INVOICES_URL}/${id}`, {headers})
}

export function addInvoiceService(token: string, data: InvoiceModel) {
  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Token ${token}`,
  }

  return axios.post<InvoiceModel[]>(`${GET_INVOICES_URL}/create/`, data, {headers})
}

export function updateInvoiceService(token: string, data: InvoiceModel) {
  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Token ${token}`,
  }

  return axios.post<InvoiceModel[]>(`${GET_INVOICES_URL}/update/`, data, {headers})
}


export function fetchSearchedCustomers(token: string, value: string, selectCustomerBy: string) {
  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Token ${token}`,
  }
  return axios.get<any>(`${GET_CUSTOMER_URL}?${selectCustomerBy}=${value}`, {headers})
}

export function fetchSearchedInventory(token: string, value: string, searchInventoryBy: string) {
  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Token ${token}`,
  }
  return axios.get<any>(`${GET_INVENTORY_URL}?${searchInventoryBy}=${value}`, {headers})
}

export function invoicePayment(token: string, data: any) {
  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Token ${token}`,
  }
  return axios.post<any>(`${POST_PAYMENT_URL}/`, data, {headers})
}

export function generateInvoicePDF(token: string, value) {
  return axios.get<any>(`${FILE_DOWNLOAD_URL}${value}`, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Token ${token}`,
    },
    responseType: 'blob',
  })
}

export const printInvoice = (token, invoice_id) => {
  return async (dispatch) => {
    return new Promise((resolve, reject) => {
      axios
        .get(`${FILE_DOWNLOAD_URL}${invoice_id}`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Token ${token}`,
          },
          responseType: 'blob',
        })
        .then((res) => {
          const blob = new Blob([res.data], {type: 'application/pdf'})
          const url = window.URL.createObjectURL(blob)
          const link = document.createElement('a')
          link.href = url
          link.setAttribute('download', `${invoice_id}.pdf`)
          document.body.appendChild(link)
          link.click()
          resolve(blob)
        })
        .catch((err) => {
          dispatch(err.response.data, err.response.status)
          reject() // Reject the promise in case of an error
        })
    })
  }
}
