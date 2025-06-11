import http from '@/shared/services/http.instance';
import { User } from '../entities/user.entity';

export class UserService {
    async getAll() {
        const response = await http.get('/users');
        return response.data.map(user => new User(user));
    }

    async getById(id) {
        const response = await http.get(`/users/${id}`);
        return new User(response.data);
    }

    async create(userData) {
        const response = await http.post('/users', userData);
        return new User(response.data);
    }

    async update(id, userData) {
        const response = await http.put(`/users/${id}`, userData);
        return new User(response.data);
    }

    async delete(id) {
        await http.delete(`/users/${id}`);
        return true;
    }
}
