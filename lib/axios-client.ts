import axios from "axios"
import { getAuthToken } from "./api"

const axiosClient = axios.create({
  baseURL: "https://vasify-crm-backend-4.onrender.com/api",
  // baseURL: "http://localhost:5000/api",
})

axiosClient.interceptors.request.use((config) => {
  const token = getAuthToken()
  if (token) {
    config.headers = config.headers || {}
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export default axiosClient
