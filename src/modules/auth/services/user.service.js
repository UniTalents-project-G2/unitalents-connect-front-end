import httpInstance from "@/shared/services/http.instance.js";
console.log("[Service 1] user.service.js cargado");


/**
 * @class UserService
 * @description Service class for handling CRUD operations on users using HTTP requests
 */
export class UserService {
    /** @type {string} The API endpoint for users */
    resourceEndpoint = import.meta.env.VITE_USERS_ENDPOINT_PATH;

    /**
     * Retrieves all usersl
     * @returns {Promise<AxiosResponse<any>>} Promise that resolves to an array of users
     */
    getAll() {
        return httpInstance.get(this.resourceEndpoint);
    }

    /**
     * Retrieves a user by its ID
     * @param {number|string} id - The ID of the user to retrieve
     * @returns {Promise<AxiosResponse<any>>} Promise that resolves to the user object
     */
    getById(id) {
        return httpInstance.get(`${this.resourceEndpoint}/${id}`);
    }

    /**
     * Creates a new user
     * @param {Object} resource - The user object to create
     * @returns {Promise<AxiosResponse<any>>} Promise that resolves to the created user
     */
    create(resource) {
        return httpInstance.post('/Users/register', resource);
    }

    /**
     * Updates an existing user
     * @param {number|string} id - The ID of the user to update
     * @param {Object} resource - The updated user data
     * @returns {Promise<AxiosResponse<any>>} Promise that resolves to the updated user
     */
    update(id, resource) {
        return httpInstance.put(`${this.resourceEndpoint}/${id}`, resource);
    }

    /**
     * Deletes a user by its ID
     * @param {number|string} id - The ID of the user to delete
     * @returns {Promise<AxiosResponse<any>>} Promise that resolves when the user is deleted
     */
    delete(id) {
        return httpInstance.delete(`${this.resourceEndpoint}/${id}`);
    }

    /**
     * Login de usuario
     * @param {{ email: string, password: string }} credentials
     * @returns {Promise<AxiosResponse<any>>}
     */
    login(credentials) {
        return httpInstance.post('/Users/login', credentials);
    }


    /**
     * Retrieves users by email
     * @param {string} email - The email to search for
     * @returns {Promise<AxiosResponse<any>>} Promise that resolves to an array of matching users
     */
    getByEmail(email) {
        return httpInstance.get(`${this.resourceEndpoint}?email=${email}`);
    }
}
