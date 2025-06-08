import httpInstance from "@/shared/services/http.instance.js";
import { Company } from "@/modules/companies/model/company.entity.js";

/**
 * @class CompanyService
 * @description Service class for handling CRUD operations on companies using HTTP requests
 */
export class CompanyService {
    /** @type {string} The API endpoint for companies */
    resourceEndpoint = import.meta.env.VITE_COMPANIES_ENDPOINT_PATH;

    /**
     * Retrieves all companies
     * @returns {Promise<AxiosResponse<any>>}
     */
    getAll() {
        return httpInstance.get(this.resourceEndpoint);
    }

    /**
     * Retrieves a company by ID
     * @param {number|string} id
     * @returns {Promise<Company>}
     */
    async getById(id) {
        const res = await httpInstance.get(`${this.resourceEndpoint}/${id}`);
        return new Company(res.data);
    }

    /**
     * Creates a new company
     * @param {Object} data
     * @returns {Promise<AxiosResponse<any>>}
     */
    create(data) {
        return httpInstance.post(this.resourceEndpoint, data);
    }

    /**
     * Updates a company
     * @param {number|string} id
     * @param {Object} data
     * @returns {Promise<AxiosResponse<any>>}
     */
    update(id, data) {
        return httpInstance.put(`${this.resourceEndpoint}/${id}`, data);
    }

    /**
     * Deletes a company
     * @param {number|string} id
     * @returns {Promise<AxiosResponse<any>>}
     */
    delete(id) {
        return httpInstance.delete(`${this.resourceEndpoint}/${id}`);
    }
}
