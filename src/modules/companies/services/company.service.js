import http from '@/shared/services/http.instance';
import { Company } from '../model/company.entity';

export class CompanyService {
    async getAll() {
        const res = await http.get('/companies');
        return res.data.map(company => new Company(company));
    }

    async getById(id) {
        const res = await http.get(`/companies/${id}`);
        return new Company(res.data);
    }

    async getByUserId(userId) {
        const res = await http.get(`/companies?userId=${userId}`);
        return res.data.map(company => new Company(company));
    }

    async create(data) {
        const res = await http.post('/companies', data);
        return new Company(res.data);
    }

    async update(id, data) {
        const res = await http.put(`/companies/${id}`, data);
        return new Company(res.data);
    }

    async delete(id) {
        await http.delete(`/companies/${id}`);
        return true;
    }
}
