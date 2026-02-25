import axios from "axios";

export const AxiosClient = axios.create({
  baseURL: "http://localhost:2404/api",
  withCredentials: true, 
});

AxiosClient.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem("accessToken");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },

)


AxiosClient.interceptors.response.use(
  (response) => response,

  async function (error) {
    const originalRequest = error.config;

    // If access token expired
    if (
      error.response?.status === 403 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      try {
        const res = await axios.get(
          `http://localhost:2404/api/refresh`,
          {
            withCredentials: true,
          },
        );
        sessionStorage.setItem("accessToken", res.data.accessToken);

        originalRequest.headers.Authorization = `Bearer ${res.data.accessToken}`;
        return axios(originalRequest);
      } catch (refreshError) {
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);

