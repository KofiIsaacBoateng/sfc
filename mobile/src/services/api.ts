import axios, {
  AxiosInterceptorManager,
  AxiosInterceptorOptions,
  AxiosRequestConfig,
  InternalAxiosRequestConfig,
} from "axios";
import auth from "@react-native-firebase/auth";

// Point this directly to your local computer running network IP address
// Avoid using localhost/127.0.0.1 since mobile emulators treat that as their own internal loop
const API_BASE_URL = "http://192.168.43.14:5000/api/v1";

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor to inject the cryptographically secure Firebase JWT token on every request
apiClient.interceptors.request.use(
  async (config: any) => {
    const currentUser = auth().currentUser;
    if (currentUser) {
      const token = await currentUser.getIdToken(true); // Grabs active cryptographic token
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);
