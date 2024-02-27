export const fetchJson = async ({ url, headers = {}, body, method = 'GET' }) => {
  const res = await fetch(url, {
    method,
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      ...headers,
    },
    body: body && JSON.stringify(body),
  });
  return res;
  // const resData = await res.json();
  // return resData;
};
