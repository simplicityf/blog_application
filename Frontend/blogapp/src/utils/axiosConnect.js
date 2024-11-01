import axios from 'axios'

const axiosInstance =  axios.create({ baseURL: "http://localhost:4000"});
axiosInstance.interceptors.request.use((config) => {
    const userData = window.localStorage.getItem("blogData");
    if (userData) {
      const { token } = JSON.parse(userData);
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
})
export default axiosInstance