import axios from 'axios'

export const apiUrl = (path: string = '') =>
  `http://${process.env.NEXT_PUBLIC_API_URL}${path}`

export const api = axios.create({
  baseURL: apiUrl(),
  headers: {
    'Access-Control-Allow-Origin': '*',
  },
})
