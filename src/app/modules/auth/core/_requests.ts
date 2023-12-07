import axios from 'axios'
import {UserModel, NewAuthModel} from './_models'

const API_URL = process.env.REACT_APP_API_URL

export const GET_USER_BY_ACCESSTOKEN_URL = `${API_URL}/api/auth/user`
export const LOGIN_URL = `${API_URL}/api/auth/login`
export const REGISTER_URL = `${API_URL}/register`
export const REQUEST_PASSWORD_URL = `${API_URL}/forgot_password`

// Server should return NewAuthModel
export function login(username: string, password: string) {
  return axios.post<NewAuthModel>(LOGIN_URL, {
    username,
    password,
  })
}

export const tokenConfig = (token) => {
  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  }
  if (token) {
    config.headers['Authorization'] = `Token ${token}`
  }
  return config
}

// Server should return AuthModel
export function register(
  email: string,
  firstname: string,
  lastname: string,
  password: string,
  password_confirmation: string
) {
  return axios.post(REGISTER_URL, {
    email,
    first_name: firstname,
    last_name: lastname,
    password,
    password_confirmation,
  })
}

// Server should return object => { result: boolean } (Is Email in DB)
export function requestPassword(email: string) {
  return axios.post<{result: boolean}>(REQUEST_PASSWORD_URL, {
    email,
  })
}

export function getUserByToken(token: string) {
  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Token ${token}`,
  }
  axios.interceptors.request.use(
    (request) => {
      console.log('Starting Request', request)
      return request
    },
    (error) => {
      // Do something with request error
      return Promise.reject(error)
    }
  )
  console.log(headers)
  return axios.get<UserModel>(GET_USER_BY_ACCESSTOKEN_URL, {headers})
}
