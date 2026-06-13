import { API_BASE_URL } from './app_constants';
import axios from 'axios'
import { getAuthTokenFromCookie } from './utill_methods';

const baseURL = API_BASE_URL;
const isServer = typeof window === 'undefined';

const axiosClient = axios.create({ baseURL })

axiosClient.interceptors.request.use(async config => {
    
    if (isServer) {

        const { cookies } = (await import('next/headers'))
        const token = cookies().get('authToken')?.value;
        const alreadyHasToken = config.headers['auth-token'] != null && config.headers['auth-token'] != ''

        if (token && alreadyHasToken == false) {
            config.headers['auth-token'] = token
        }
    } else {
        const token = getAuthTokenFromCookie(document.cookie);

        if (token) {
            config.headers['auth-token'] =  token
        }
    }

    return config
});

axiosClient.interceptors.response.use(
    response => response,
    error => {
        const status = error?.response?.status;
        if (status === 403) {
            console.warn("S3 pre-signed URL expired or forbidden. Redirecting to login...");

            if (typeof window !== "undefined") {
                sessionStorage.clear();
                localStorage.clear();
                window.location.href = "/auth/login";
            }
        }
        
        if (status === 401) {
            console.warn("Token expired. Redirecting to login...");

            if (typeof window !== "undefined") {
                sessionStorage.clear();
                localStorage.clear();
                window.location.href = "/auth/login";
            }
        }

        return Promise.reject(error);
    }
);

export default axiosClient;
