const BASE_URL = import.meta.env.VITE_API_URL || '/api';

function getToken() {
  return localStorage.getItem('token');
}

async function request(path, options = {}) {
  const token = getToken();
  const headers = { 'Content-Type': 'application/json', ...options.headers };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${BASE_URL}${path}`, { ...options, headers });

  if (response.status === 204) return null;
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || 'Erreur serveur');
  return data;
}

export function login(identifiant, password) {
  return request('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ identifiant, password }),
  });
}

export function getUsers() {
  return request('/users');
}

export function createUser(userData) {
  return request('/users', {
    method: 'POST',
    body: JSON.stringify(userData),
  });
}

export function updateUser(id, userData) {
  return request(`/users/${id}`, {
    method: 'PUT',
    body: JSON.stringify(userData),
  });
}

export function deleteUser(id) {
  return request(`/users/${id}`, { method: 'DELETE' });
}

export function getCocktails(params = {}) {
  const query = new URLSearchParams(params).toString();
  const path = query ? `/cocktails?${query}` : '/cocktails';
  return request(path);
}

export function getCocktail(id) {
  return request(`/cocktails/${id}`);
}

export function createCocktail(data) {
  return request('/cocktails', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export function updateCocktail(id, data) {
  return request(`/cocktails/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export function deleteCocktail(id) {
  return request(`/cocktails/${id}`, { method: 'DELETE' });
}

export function getOrders(params = {}) {
  const query = new URLSearchParams(params).toString();
  const path = query ? `/orders?${query}` : '/orders';
  return request(path);
}

export function getOrder(id) {
  return request(`/orders/${id}`);
}

export function createOrder(data) {
  return request('/orders', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export function updateOrder(id, data) {
  return request(`/orders/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export function deleteOrder(id) {
  return request(`/orders/${id}`, { method: 'DELETE' });
}
