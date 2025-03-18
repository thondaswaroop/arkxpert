// src/services/api/Api.tsx

import axios, { AxiosResponse, AxiosError } from "axios";
import { AppEnvironment } from "../../constants/Global";
import { loggerService } from "../../utils/CommonUtils";

// Define interfaces for HTTP headers and methods
interface HttpHeaders {
    Accept?: any;
    "Content-Type": any;
}

interface FileHeaders {
    "Content-Type": any;
}

interface MethodType {
    "get": string,
    "post": string
}

// Define a type for HTTP methods
type Methods = "head" | "options" | "put" | "post" | "patch" | "delete" | "get";

// Create a class for HTTP service
class HttpService {
    // Initialize the base URL for API requests
    private apiBaseURL: string = AppEnvironment.ApiUrl;

    // Define default headers for JSON requests
    private headers: HttpHeaders = {
        "Content-Type": "application/json",
    };

    // Define headers for file uploads
    private fileHeaders: FileHeaders = {
        "Content-Type": "multipart/form-data",
    };

    // GET Method
    async get<T>(url: string, queryParams?: any, customHeaders?: HttpHeaders): Promise<T> {
        const headers: HttpHeaders = { ...this.headers, ...(customHeaders || {}) };
        try {
            const response: AxiosResponse<T> = await this.makeRequest('get', url, { headers, params: queryParams });
            return response.data;
        } catch (error: any) {
            throw this.handleAxiosError(error);
        }
    }

    // POST Method
    async post<T>(url: string, data: any, queryParams?: any, customHeaders?: HttpHeaders, mediaType?: any): Promise<T> {
        const headers: HttpHeaders = { ...this.headers, ...(customHeaders || {}) };
        const responseType = mediaType ? { responseType: 'blob' } : undefined;
        try {
            const response: AxiosResponse<T> = await this.makeRequest('post', url, data, { headers, ...responseType });
            return response.data;
        } catch (error: any) {
            throw this.handleAxiosError(error);
        }
    }

    // POST Method for file uploads
    async postFile<T>(url: string, data: any, queryParams?: any, customHeaders?: HttpHeaders): Promise<T> {
        const headers: HttpHeaders = { ...this.fileHeaders, ...(customHeaders || {}) };
        try {
            const response: AxiosResponse<T> = await this.makeRequest('post', url, data, { headers });
            return response.data;
        } catch (error: any) {
            throw this.handleAxiosError(error);
        }
    }

    // Generic request method
    private async makeRequest<T>(method: Methods, url: string, data?: any, config: any = {}): Promise<AxiosResponse<T>> {
        try {
            loggerService('default', 'Network log', this.apiBaseURL + url);
            const response: AxiosResponse<T> = await axios[method](this.apiBaseURL + url, data, config);
            return response;
        } catch (error) {
            throw error;
        }
    }

    // Handle Axios errors
    private handleAxiosError(error: AxiosError): any {
        if (error.response) {
            if (error.response.status >= 400 && error.response.status < 500) {
                throw error.response.data;
            } else {
                const message = {
                    title: "Server Error",
                    content: "Please try again later",
                };
                error.response.data = { message };
                throw error.response.data;
            }
        } else {
            throw error;
        }
    }
}

// Create an instance of the HTTP service and export it
export const httpService = new HttpService();
