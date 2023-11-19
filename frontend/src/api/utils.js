export const fetchJson = async ({ url, body, method = 'GET' }) => {
  const res = await fetch(url, {
    method,
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: body && JSON.stringify(body),
  });
  const resData = await res.json();
  return resData;
};
