import axios from "axios";

const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_AUTH,
  withCredentials: true,
});

export default axiosInstance;
