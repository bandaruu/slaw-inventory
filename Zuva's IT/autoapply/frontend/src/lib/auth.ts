import Cookies from 'js-cookie';
import api from './api';

export interface User {
  _id: string;
  name: string;
  email: string;
  plan: 'free' | 'pro';
  avatar?: string;
}

export function getToken(): string | undefined {
  return Cookies.get('zuva_token');
}

export function setToken(token: string) {
  Cookies.set('zuva_token', token, { expires: 7, secure: true, sameSite: 'strict' });
}

export function removeToken() {
  Cookies.remove('zuva_token');
}

export function isAuthenticated(): boolean {
  return !!getToken();
}

export async function getUser(): Promise<User | null> {
  try {
    const res = await api.get('/api/auth/me');
    return res.data.user;
  } catch {
    return null;
  }
}

export function logout() {
  removeToken();
  window.location.href = '/';
}
