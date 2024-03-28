export const fetchJson = async ({ url, headers = {}, body, method = 'GET' }) => {
  
  const token = localStorage.token;
  const res = await fetch(url, {
    method,
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: token && `Bearer ${token}`,
      ...headers,
    },
    body: body && JSON.stringify(body),    
  });
  return res;
  // const resData = await res.json();
  // return resData;
};
