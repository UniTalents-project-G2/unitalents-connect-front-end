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
            title: projectData.title,
            description: projectData.description,
            field: projectData.field,
            skills: Array.from(projectData.skills),
            budget: projectData.budget,
            status: projectData.status
        };

        const token = localStorage.getItem('token');

        const response = await http.post('/projects', dataToSend, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return new Project(response.data);
    }

    async update(id, projectData) {
        const dataToSend = {
            title: projectData.title,
            description: projectData.description,
            field: projectData.field,
            skills: Array.from(projectData.skills),
            budget: projectData.budget,
            status: projectData.status,
            isFinished: projectData.status === 'Finished'
        };

        const token = localStorage.getItem('token');

        const response = await http.put(`/projects/${id}`, dataToSend, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return new Project(response.data);
    }

    async delete(id) {
        const token = localStorage.getItem('token');
        await http.delete(`/projects/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return true;
    }

    async getAvailable() {
        const response = await http.get(`/projects?selectedStudent=null`);
        return response.data.map(project => new Project(project));
    }
}

export const projectService = new ProjectService();
