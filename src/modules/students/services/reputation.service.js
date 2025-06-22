import httpInstance from "@/shared/services/http.instance.js";
import { Reputation } from "@/modules/students/model/reputation.entity.js";

/**
 * @class ReputationService
 * @description Service class for handling operations related to student reputations
 */
export class ReputationService {
    /** @type {string} The API endpoint for reputations */
    resourceEndpoint = import.meta.env.VITE_REPUTATIONS_ENDPOINT_PATH;

    /**
     * Retrieves all reputations
     * @returns {Promise<Reputation[]>}
     */
    async getAll() {
        const res = await httpInstance.get(this.resourceEndpoint);
        return res.data.map(r => new Reputation(r));
    }

    /**
     * Retrieves reputations by student ID
     * @param {number|string} studentId
     * @returns {Promise<Reputation[]>}
     */
    async getByStudentId(studentId) {
        const res = await httpInstance.get(`${this.resourceEndpoint}?studentId=${studentId}`);
        return res.data.map(r => new Reputation(r));
    }

    /**
     * Creates a new reputation
     * @param {Object} data
     * @returns {Promise<Reputation>}
     */
    async create(data) {
        const res = await httpInstance.post(this.resourceEndpoint, data);
        return new Reputation(res.data);
    }
}
