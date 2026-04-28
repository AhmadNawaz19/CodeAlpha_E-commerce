const API = 'http://localhost:4000/api';

export const api = async (path, opts = {}) => {
  const token = localStorage.getItem('token');
  const res = await fetch(API + path, {
    ...opts,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...opts.headers,
    },
  });
  if (!res.ok) throw new Error((await res.json()).error || 'Error');
  return res.json();
};
