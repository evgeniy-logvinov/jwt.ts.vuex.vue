import axios from 'axios';
import apiCall from '@/api';
import ApiSecurity from '@/api/ApiSecurity';

export const RestErrors = {
    UNAUTHORAIZED: 401,
    FORBIDDEN: 403,
};

const apiV1 = 'api/v1/';

export default class ApiClientService {
    public client: any = {};
    private defaultHeaders: any = {};

    constructor(options: any = {}) {
        this.defaultHeaders = options.headers || {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        };

        this.client = options.client ||
            axios.create({
                baseURL: process.env.VUE_APP_BASE_URI ? `${process.env.VUE_APP_BASE_URI}${apiV1}` : `${apiV1}`,
                headers: this.defaultHeaders,
            });

        this.client.interceptors.request.use(
            (config: any) => {
                if (!localStorage.getItem('token')) {
                    return config;
                }
                const newHeaders: any = {
                    ...this.defaultHeaders,
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                };

                return {
                    ...config,
                    headers: newHeaders,
                };
            },
            (e: any) => Promise.reject(e),
        );

        this.client.interceptors.response.use(
            (r: any) => r.data,
            async (error: any) => {
                if (error.response && error.response.status === RestErrors.UNAUTHORAIZED
                    && !error.response.config.url.includes('/token')
                    && !error.config.retry) {
                    try {
                        const { token }: { token: string } = await apiCall({
                            requestApi: ApiSecurity.token,
                            options: {
                                headers: {
                                    'Accept': 'application/json',
                                    'Content-Type': 'application/json',
                                    'x-refresh-token': localStorage.getItem('refreshToken'),
                                },
                            },
                        });
                        localStorage.setItem('token', token);

                        const newRequest = {...error.config};
                        newRequest.headers.retry = true;
                        return this.client(newRequest);
                    } catch (err) {
                        this.removeTokens();
                        throw err;
                    }
                }

                throw error;
            },
            (e: any) => Promise.reject(e),
        );
    }

    private removeTokens() {
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
    }
}
