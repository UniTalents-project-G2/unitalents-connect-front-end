import httpInstance from "@/shared/services/http.instance.js";
import { Student } from "@/modules/students/model/student.entity.js";

/**
 * @class StudentService
 * @description Service class for handling CRUD operations on students using HTTP requests
 */
export class StudentService {
    /** @type {string} The API endpoint for students */
    resourceEndpoint = import.meta.env.VITE_STUDENTS_ENDPOINT_PATH;

    /**
     * Retrieves all students
     * @returns {Promise<AxiosResponse<any>>}
     */
    getAll() {
        return httpInstance.get(this.resourceEndpoint)
            .then(res => res.data.map(studentData => new Student(studentData)));
    }

    /**
     * Retrieves a student by ID
     * @param {number|string} id
     * @returns {Promise<Student>}
     */
    async getById(id) {
        const res = await httpInstance.get(`${this.resourceEndpoint}/${id}`);
        return new Student(res.data);
    }

    /**
     * Creates a new student
     * @param {Object} data
     * @returns {Promise<AxiosResponse<any>>}
     */
    create(data) {
        return httpInstance.post(this.resourceEndpoint, data);
    }

    /**
     * Updates a student
     * @param {number|string} id
     * @param {Object} data
     * @returns {Promise<AxiosResponse<any>>}
     */
    update(id, data) {
        return httpInstance.put(`${this.resourceEndpoint}/${id}`, data);
    }

    /**
     * Deletes a student
     * @param {number|string} id
     * @returns {Promise<AxiosResponse<any>>}
     */
    delete(id) {
        return httpInstance.delete(`${this.resourceEndpoint}/${id}`);
    }
    /**
     * Retrieves a student by user ID
     * @param {number|string} userId
     * @returns {Promise<Student>}
     */
    getByUserId(userId) {
        return httpInstance
            .get(`${this.resourceEndpoint}?userId=${userId}`)
            .then(res => {
                if (res.data.length === 0) throw new Error("No student found with that userId");
                return new Student(res.data[0]); // Usamos el primero del array
            });
    }

}
