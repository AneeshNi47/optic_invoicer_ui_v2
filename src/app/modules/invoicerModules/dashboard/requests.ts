import axios from 'axios'
import {InvoicerDashboardModel} from './_models'

const API_URL = process.env.REACT_APP_API_URL

export const GET_ORGANISATION_URL = `${API_URL}/api/refresh_organization`

// Server should return organisations
export function getOrganizations(token: string) {
  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Token ${token}`,
  }

  return axios.get<InvoicerDashboardModel>(`${GET_ORGANISATION_URL}`, {headers})
}
