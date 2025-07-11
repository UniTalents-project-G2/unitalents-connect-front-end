// src/modules/projects/services/postulation.service.js
import httpInstance from "@/shared/services/http.instance";
import { StudentPostulation } from "@/modules/student-postulations/model/student-postulation.entity.js";
import { CompanyService } from "@/modules/companies/services/company.service";

const companyService   = new CompanyService();
const resourceEndpoint = import.meta.env.VITE_STUDENT_POSTULATIONS_ENDPOINT_PATH;

export const postulationService = {
    // ---------- crear ----------
    async create(postulationData) {
        try {
            const token = localStorage.getItem("token");
            const res   = await httpInstance.post(resourceEndpoint, postulationData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            return new StudentPostulation(res.data);
        } catch (err) {
            console.error("Error creating postulation:", err);
            throw err;
        }
    },

    // ---------- consultas ----------
    async getByStudent(studentId) {
        const res = await httpInstance.get(`${resourceEndpoint}?studentId=${studentId}`);
        return res.data.map(p => new StudentPostulation(p));
    },

    async getByProject(projectId) {
        const res = await httpInstance.get(`${resourceEndpoint}?projectId=${projectId}`);
        return res.data.map(p => new StudentPostulation(p));
    },

    // ---------- ACTUALIZAR (aceptar / rechazar) ----------
    /**
     * Llama a PUT /studentpostulations/{id}/accept en el backend.
     * El backend se encarga de:
     *   • marcar esta postulación como aceptada,
     *   • rechazar las demás,
     *   • actualizar el proyecto.
     */
    async update(postulationId, body = {}) {
        try {
            const token = localStorage.getItem("token");
            const res   = await httpInstance.put(
                `${resourceEndpoint}/${postulationId}/accept`,   // ← /accept
                body,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            return new StudentPostulation(res.data);
        } catch (err) {
            console.error("Error updating postulation:", err);
            throw err;
        }
    },

    // (opcional) helper explícito
    async accept(postulationId) {
        return this.update(postulationId);
    },

    // ---------- utilidades ----------
    async getCompaniesForProjects(projectIds) {
        try {
            const projects   = await Promise.all(projectIds.map(id => httpInstance.get(`/projects/${id}`)));
            const companyIds = [...new Set(projects.map(p => p.data.companyId))];
            return await Promise.all(companyIds.map(id => companyService.getById(id)));
        } catch (err) {
            console.error("Error fetching companies:", err);
            throw err;
        }
    }
};
