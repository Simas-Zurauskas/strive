import axios from 'axios';
import { signOut } from 'next-auth/react';
import { toast } from 'sonner';

export const client = axios.create({
  baseURL: `/api`,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
});

client.interceptors.response.use(
  (response) => response,
  (err) => {
    if (err.response) {
      if (err.response.status === 401) {
        signOut();
      }
    }

    toast.error(err.response?.data?.message || 'Something went wrong', {
      richColors: true,
      duration: 10000,
    });

    return Promise.reject(err.response?.data as { message: string });
  },
);
