type FetchOptions = {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  body?: BodyInit | Record<string, unknown>;
  headers?: HeadersInit;
  isJSON?: boolean;
};

const sendRequest = async (url: string, options: FetchOptions = {}) => {
  const { method = 'GET', headers, isJSON = true, body } = options;

  const { finalBody, finalHeaders } = (() => {
    if (body instanceof FormData || body instanceof Blob) {
      return { finalBody: body, finalHeaders: new Headers(headers) };
    }

    if (body && isJSON) {
      const newHeaders = new Headers(headers);
      newHeaders.set('Content-Type', 'application/json; charset=utf-8');

      return {
        finalBody: JSON.stringify(body),
        finalHeaders: newHeaders,
      };
    }

    return { finalBody: undefined, finalHeaders: new Headers(headers) };
  })();

  const response = await fetch(url, {
    method,
    body: finalBody,
    headers: finalHeaders,
    credentials: 'include',
  });

  return response;
};

export default sendRequest;
