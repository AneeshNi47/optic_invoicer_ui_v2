import axios from 'axios'
import {AddOrganisationModel, OrganisationModel} from './_models'

const API_URL = process.env.REACT_APP_API_URL

export const GET_ORGANISATION_URL = `${API_URL}/api/list_organization`
export const CREATE_ORGANISATION_URL = `${API_URL}/api/create_organization`

// Server should return organisations
export function getOrganisations(token: string) {
  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Token ${token}`,
  }

  return axios.get<OrganisationModel>(`${GET_ORGANISATION_URL}/`, {headers})
}

export function addOrganisation(token: string, data: any) {
  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Token ${token}`,
  }

  return axios.post<AddOrganisationModel>(`${CREATE_ORGANISATION_URL}/`, data, {headers})
}
