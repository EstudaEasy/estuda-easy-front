import axios from 'axios';

export const api = axios.create({
  baseURL: 'https://estuda-easy-api.onrender.com',
  headers: {
    'Content-Type': 'application/json',
  },
});