import { api } from './api';

const UserService = {
  login(data: any) {
    return api.post('/auth/login', data);
  },

  registerUser(user: any) {
    return api.post('/users', user);
  },

  getById(id: string) {
    return api.get(`/users/${id}`);
  },

  updateUser(id: string, user: any) {
    return api.patch(`/users/${id}`, user);
  },

  deleteUser(id: string) {
    return api.delete(`/users/${id}`);
  }
};

export default UserService;