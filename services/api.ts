import axios from 'axios';

export const api = axios.create({
  baseURL: 'http://10.0.0.221:8080', // or your LAN IP if using physical device
});
