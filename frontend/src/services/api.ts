type FetchOptions = {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  body?: any;
  headers?: {
    [headerName: string]: string;
  };
  isJSON?: boolean;
};

const sendRequest = async (url: string, options: FetchOptions = {}) => {
  const { method, headers, isJSON = true, body } = options;

  const finalHeaders = { ...headers };
  let finalBody = undefined;

  if (body instanceof FormData) {
    // Do NOT set Content-Type for FormData; browser will set it
    finalBody = body;
  } else if (body instanceof Blob) {
    finalBody = body;
  } else if (body && isJSON) {
    finalHeaders['Content-Type'] = 'application/json; charset=utf-8';
    finalBody = JSON.stringify(body);
  }

  const response = await fetch(url, {
    method: method || 'GET',
    body: finalBody,
    headers: finalHeaders,
    credentials: 'include',
  });

  return response;
};

export default sendRequest;
