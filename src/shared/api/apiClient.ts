import axios, {
  AxiosError,
  type AxiosRequestConfig,
  type Method,
} from 'axios';

export interface ApiClientRequestOptions
  extends Omit<AxiosRequestConfig, 'data' | 'headers' | 'method' | 'url'> {
  body?: unknown;
  fallbackErrorMessage?: string;
  headers?: Record<string, string>;
  method?: Method;
  rawBody?: AxiosRequestConfig['data'];
  throwOnHttpError?: boolean;
  token?: string | null;
}

export interface ApiClientResponse<TData = unknown> {
  data: TData | undefined;
  ok: boolean;
  status: number;
}

export const apiBaseUrl = (
  import.meta.env.VITE_API_BASE_URL ?? 'https://localhost:7140'
)
  .trim()
  .replace(/\/$/, '');

export const hasApiBaseUrl = apiBaseUrl.length > 0;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function readString(
  record: Record<string, unknown>,
  camelKey: string,
  pascalKey: string,
) {
  const value = record[camelKey] ?? record[pascalKey];

  return typeof value === 'string' ? value : undefined;
}

export function getResponseMessage(value: unknown, fallback: string) {
  if (!isRecord(value)) {
    return fallback;
  }

  return readString(value, 'message', 'Message') ?? fallback;
}

function createHeaders({
  body,
  headers,
  rawBody,
  token,
}: Pick<ApiClientRequestOptions, 'body' | 'headers' | 'rawBody' | 'token'>) {
  const nextHeaders: Record<string, string> = { ...headers };

  if (body !== undefined && rawBody === undefined && !nextHeaders['Content-Type']) {
    nextHeaders['Content-Type'] = 'application/json';
  }

  if (token) {
    nextHeaders.Authorization = `Bearer ${token}`;
  }

  return nextHeaders;
}

function createRequestBody(
  body: unknown,
  rawBody: AxiosRequestConfig['data'] | undefined,
) {
  if (rawBody !== undefined) {
    return rawBody;
  }

  return body === undefined ? undefined : JSON.stringify(body);
}

function normalizeApiPath(path: string) {
  return path.startsWith('/') ? path : `/${path}`;
}

export function isMockEnabled(flagName: string) {
  return import.meta.env[flagName] === 'true' || !hasApiBaseUrl;
}

const axiosClient = axios.create({
  baseURL: apiBaseUrl,
  validateStatus: () => true,
});

function createNetworkErrorMessage(fallbackErrorMessage?: string) {
  return fallbackErrorMessage ?? 'No se pudo conectar con el servidor.';
}

export const apiClient = {
  async request<TData = unknown>(
    path: string,
    {
      body,
      fallbackErrorMessage,
      headers,
      method,
      rawBody,
      throwOnHttpError = true,
      token,
      ...init
    }: ApiClientRequestOptions = {},
  ): Promise<ApiClientResponse<TData>> {
    try {
      const response = await axiosClient.request<TData>({
        ...init,
        data: createRequestBody(body, rawBody),
        headers: createHeaders({ body, headers, rawBody, token }),
        method,
        url: normalizeApiPath(path),
      });

      if (response.status < 200 || response.status >= 300) {
        if (throwOnHttpError) {
          const httpFallbackMessage = fallbackErrorMessage
            ? `${fallbackErrorMessage} Estado HTTP ${response.status}.`
            : `No se pudo completar la operacion. Estado HTTP ${response.status}.`;

          throw new Error(
            getResponseMessage(
              response.data,
              httpFallbackMessage,
            ),
          );
        }
      }

      return {
        data: response.data,
        ok: response.status >= 200 && response.status < 300,
        status: response.status,
      };
    } catch (error) {
      if (error instanceof AxiosError && !error.response) {
        throw new Error(createNetworkErrorMessage(fallbackErrorMessage));
      }

      throw error;
    }
  },
};
