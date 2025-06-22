// src/modules/projects/services/postulation.service.js
import httpInstance from "@/shared/services/http.instance";
import { StudentPostulation} from "@/modules/student-postulations/model/student-postulation.entity.js";
import { CompanyService } from "@/modules/companies/services/company.service";

const companyService = new CompanyService();

export const postulationService = {
    async create(postulationData) {
        try {
            const response = await httpInstance.post("/postulations", postulationData);
            return new StudentPostulation(response.data);
        } catch (error) {
            console.error("Error creating postulation:", error);
            throw error;
        }
    },

    async getByStudent(studentId) {
        try {
            const response = await httpInstance.get(`/postulations?studentId=${studentId}`);
            return response.data.map(p => new StudentPostulation(p));
        } catch (error) {
            console.error("Error fetching student postulations:", error);
            throw error;
        }
    },

    async getByProject(projectId) {
        try {
            const response = await httpInstance.get(`/postulations?projectId=${projectId}`);
            return response.data.map(p => new StudentPostulation(p));
        } catch (error) {
            console.error("Error fetching project postulations:", error);
            throw error;
        }
    },


    async getCompaniesForProjects(projectIds) {
        try {
            const projects = await Promise.all(
                projectIds.map(id => httpInstance.get(`/projects/${id}`))
            );
            const companyIds = [...new Set(projects.map(p => p.data.companyId))];
            return await Promise.all(
                companyIds.map(id => companyService.getById(id))
            );
        } catch (error) {
            console.error("Error fetching companies:", error);
            throw error;
        }
    }
};