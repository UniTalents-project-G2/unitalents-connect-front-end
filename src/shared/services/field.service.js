import httpInstance from "@/shared/services/http.instance.js";

/**
 * @class FieldService
 * @description Service class for handling CRUD operations on fields using HTTP requests
 */
export class FieldService {
    /** @type {string} The API endpoint for fields */
    resourceEndpoint = import.meta.env.VITE_FIELDS_ENDPOINT_PATH;

    /**
     * Retrieves all fields
     * @returns {Promise<AxiosResponse<any>>} Promise that resolves to an array of fields
     */
    getAll() {
        return httpInstance.get(this.resourceEndpoint);
    }

    /**
     * Retrieves a field by its ID
     * @param {number|string} id - The ID of the field to retrieve
     * @returns {Promise<AxiosResponse<any>>} Promise that resolves to the field object
     */
    getById(id) {
        return httpInstance.get(`${this.resourceEndpoint}/${id}`);
    }

    /**
     * Retrieves fields by name
     * @param {string} name - The name to search for
     * @returns {Promise<AxiosResponse<any>>} Promise that resolves to an array of matching fields
     */
    getByName(name) {
        return httpInstance.get(`${this.resourceEndpoint}?name=${name}`);
    }
}
