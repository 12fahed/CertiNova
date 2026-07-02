import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import env from '@/config/env';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getFullImageUrl(path: string): string {
  if (!path) return '';
  if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('data:')) {
    return path;
  }
  // Remove /api from API_BASE_URL to get the root URL
  const baseUrl = env.API_BASE_URL.replace(/\/api$/, '').replace(/\/$/, '');
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${baseUrl}${cleanPath}`;
}
