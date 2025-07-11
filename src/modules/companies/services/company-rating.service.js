// src/modules/companies/services/company-rating.service.js
import http from '@/shared/services/http.instance';

export class CompanyRatingService {
    /**
     * Envía la calificación (1-5) para la empresa del proyecto.
     * @param {{ projectId:number, rating:number }} payload
     */
    async create(payload) {
        const token = localStorage.getItem('token');
        await http.post('/companyratings', payload, {
            headers: { Authorization: `Bearer ${token}` }
        });
    }

    /**
     * Devuelve true si el estudiante ya calificó la empresa de ese proyecto.
     * @param {number} projectId
     */
    async hasRated(projectId) {
        const token = localStorage.getItem('token');
        const res = await http.get(`/companyratings/exists?projectId=${projectId}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return res.data?.rated === true;
    }
}

export const companyRatingService = new CompanyRatingService();
