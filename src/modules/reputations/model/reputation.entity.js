export class Reputation {
    constructor({ id, studentId, projectId, rating, comment }) {
        this.id = id;
        this.studentId = studentId;
        this.projectId = projectId;
        this.rating = rating;
        this.comment = comment;
    }
}
