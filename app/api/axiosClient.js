import axios from "axios"

const axiosClient = axios.create({
  // baseURL: "https://vasify-crm-backend-4.onrender.com/api",
  // baseURL: "https://vasify-crm-backend-2.onrender.com/api",
  
  baseURL: "http://localhost:5000/api",
})

axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("token")
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export default axiosClient
