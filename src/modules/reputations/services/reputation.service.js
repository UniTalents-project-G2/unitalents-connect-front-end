// src/modules/reputations/services/reputation.service.js
import http from '@/shared/services/http.instance';
import { Reputation } from '@/modules/reputations/model/reputation.entity';

export class ReputationService {
    async create(reputationData) {
        try {
            const response = await http.post('/reputations', reputationData);
            return new Reputation(response.data);
        } catch (error) {
            console.error('Error creando reputación:', error);
            throw error;
        }
    }

    async getByStudentId(studentId) {
        try {
            const response = await http.get(`/reputations?studentId=${studentId}`);
            return response.data.map(rep => new Reputation(rep));
        } catch (error) {
            console.error('Error obteniendo reputaciones del estudiante:', error);
            throw error;
        }
    }

    async getByProjectId(projectId) {
        try {
            const response = await http.get(`/reputations?projectId=${projectId}`);
            return response.data.map(rep => new Reputation(rep));
        } catch (error) {
            console.error('Error obteniendo reputaciones del proyecto:', error);
            throw error;
        }
    }

    async getAll() {
        try {
            const response = await http.get('/reputations');
            return response.data.map(rep => new Reputation(rep));
        } catch (error) {
            console.error('Error obteniendo todas las reputaciones:', error);
            throw error;
        }
    }
}

export const reputationService = new ReputationService();
