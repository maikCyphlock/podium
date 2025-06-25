import { ApiResponse } from './response';

type RequestOptions = {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  headers?: Record<string, string>;
  body?: any;
  credentials?: RequestCredentials;
};

export class ApiClient {
  private baseUrl: string;
  private defaultHeaders: Record<string, string>;

  constructor(baseUrl: string = '') {
    this.baseUrl = baseUrl;
    this.defaultHeaders = {
      'Content-Type': 'application/json',
    };
  }

  private async request<T = any>(
    endpoint: string,
    options: RequestOptions = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const { method = 'GET', headers = {}, body, credentials = 'include' } = options;

    const config: RequestInit = {
      method,
      headers: { ...this.defaultHeaders, ...headers },
      credentials,
    };

    if (body && method !== 'GET' && method !== 'HEAD') {
      config.body = JSON.stringify(body);
    }

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new ApiError(
          response.status,
          data.error || 'Error en la solicitud',
          data.details
        );
      }

      return data;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(500, 'Error de conexión');
    }
  }

  public get<T = any>(endpoint: string, options: Omit<RequestOptions, 'method' | 'body'> = {}) {
    return this.request<T>(endpoint, { ...options, method: 'GET' });
  }

  public post<T = any>(
    endpoint: string,
    body: any,
    options: Omit<RequestOptions, 'method'> = {}
  ) {
    return this.request<T>(endpoint, { ...options, method: 'POST', body });
  }

  public put<T = any>(
    endpoint: string,
    body: any,
    options: Omit<RequestOptions, 'method'> = {}
  ) {
    return this.request<T>(endpoint, { ...options, method: 'PUT', body });
  }

  public patch<T = any>(
    endpoint: string,
    body: any,
    options: Omit<RequestOptions, 'method'> = {}
  ) {
    return this.request<T>(endpoint, { ...options, method: 'PATCH', body });
  }

  public delete<T = any>(
    endpoint: string,
    options: Omit<RequestOptions, 'method' | 'body'> = {}
  ) {
    return this.request<T>(endpoint, { ...options, method: 'DELETE' });
  }
}

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
    public details?: any
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

// Cliente API preconfigurado para la aplicación
export const apiClient = new ApiClient(process.env.NEXT_PUBLIC_API_BASE_URL || '');
