import axios from 'axios'

const API_URL = process.env.REACT_APP_API_URL

export const GET_ORGANIZATION_REPORT = `${API_URL}/api/report_organization`
export const GET_ORGANIZATION_MODEL_REPORT = `${API_URL}/api/model_report_organization`

// Server should return Inventory
export function getOrganizationReport(
  token: string,
  start_date: string,
  end_date: string,
  date_request_string: string
) {
  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Token ${token}`,
  }
  return axios.get<any>(
    `${GET_ORGANIZATION_REPORT}?start_date=${start_date}&end_data=${end_date}&date_request_string=${date_request_string}`,
    {headers}
  )
}

// Server should return Inventory
export function getOrganizationModelReport(
  token: string,
  start_date: string,
  end_date: string,
  model: string,
  date_request_string: string
) {
  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Token ${token}`,
  }

  return axios.get<any>(
    `${GET_ORGANIZATION_MODEL_REPORT}?model=${model}&start_date=${start_date}&end_data=${end_date}&date_request_string=${date_request_string}`,
    {headers}
  )
}
