export interface ApiClientRequestOptions
  extends Omit<RequestInit, 'body' | 'headers'> {
  body?: unknown;
  fallbackErrorMessage?: string;
  headers?: Record<string, string>;
  rawBody?: BodyInit | null;
  throwOnHttpError?: boolean;
  token?: string | null;
}

export interface ApiClientResponse<TData = unknown> {
  data: TData | undefined;
  ok: boolean;
  status: number;
}

export const apiBaseUrl = (import.meta.env.VITE_API_BASE_URL ?? '')
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

async function readJsonResponse(response: Response) {
  const text = await response.text();

  if (!text) {
    return undefined;
  }

  try {
    return JSON.parse(text) as unknown;
  } catch {
    return undefined;
  }
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
  rawBody: BodyInit | null | undefined,
) {
  if (rawBody !== undefined) {
    return rawBody;
  }

  return body === undefined ? undefined : JSON.stringify(body);
}

export const apiClient = {
  async request<TData = unknown>(
    path: string,
    {
      body,
      fallbackErrorMessage,
      headers,
      rawBody,
      throwOnHttpError = true,
      token,
      ...init
    }: ApiClientRequestOptions = {},
  ): Promise<ApiClientResponse<TData>> {
    const response = await fetch(`${apiBaseUrl}${path}`, {
      ...init,
      body: createRequestBody(body, rawBody),
      headers: createHeaders({ body, headers, rawBody, token }),
    });
    const data = (await readJsonResponse(response)) as TData | undefined;

    if (!response.ok && throwOnHttpError) {
      const httpFallbackMessage = fallbackErrorMessage
        ? `${fallbackErrorMessage} Estado HTTP ${response.status}.`
        : `No se pudo completar la operacion. Estado HTTP ${response.status}.`;

      throw new Error(
        getResponseMessage(
          data,
          httpFallbackMessage,
        ),
      );
    }

    return {
      data,
      ok: response.ok,
      status: response.status,
    };
  },
};
