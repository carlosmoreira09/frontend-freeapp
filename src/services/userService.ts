import api from './api';

interface User {
  id: string;
  name: string;
  email: string;
  isActive: boolean;
  roleId: string;
  createdAt: string;
  updatedAt: string;
}

interface UpdateUserPayload {
  name?: string;
  email?: string;
  isActive?: boolean;
}

interface ChangePasswordPayload {
  currentPassword: string;
  newPassword: string;
}

// User service
const userService = {
  // Get user by ID
  getUserById: async (id: string): Promise<User> => {
    const response = await api.get<User>(`/users/${id}`);
    return response.data;
  },

  // Update user
  updateUser: async (id: string, data: UpdateUserPayload): Promise<User> => {
    const response = await api.put<User>(`/users/${id}`, data);
    return response.data;
  },

  // Change password
  changePassword: async (id: string, data: ChangePasswordPayload): Promise<void> => {
    await api.post(`/users/${id}/change-password`, data);
  }
};

export default userService;
