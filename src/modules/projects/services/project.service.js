import http from '@/shared/services/http.instance';
import { Project } from '../entities/project.entity';

export class ProjectService {
    async getAll() {
        const response = await http.get('/projects');
        return response.data.map(project => new Project(project));
    }

    async getById(id) {
        if (!id || id === 'new') {
            return null;
        }
        const response = await http.get(`/projects/${id}`);
        return new Project(response.data);
    }

    async getByCompanyId(companyId) {
        const response = await http.get(`/projects?companyId=${companyId}`);
        return response.data.map(project => new Project(project));
    }

    async create(projectData) {
        const dataToSend = {
            ...projectData,
            isFinished: projectData.status === 'Finalizado',
            studentSelected: projectData.status === 'En curso' ? null : projectData.studentSelected
        }
        const response = await http.post('/projects', dataToSend)
        return new Project(response.data)
    }

    async update(id, projectData) {
        const dataToSend = {
            ...projectData,
            isFinished: projectData.status === 'Finalizado'
            // Ya no forzamos studentSelected a null
        }
        const response = await http.put(`/projects/${id}`, dataToSend);
        return new Project(response.data);
    }


    async delete(id) {
        await http.delete(`/projects/${id}`);
        return true;
    }

    async getAvailable() {
        const response = await http.get(`/projects?selectedStudent=null`);
        return response.data.map(project => new Project(project));
    }

}
export const projectService = new ProjectService();
