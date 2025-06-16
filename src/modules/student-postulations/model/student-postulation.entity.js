// src/modules/projects/models/student-postulation.entity.js
export class StudentPostulation {
    constructor({ id, studentId, projectId, status, date }) {
        this.id = id;
        this.studentId = studentId;
        this.projectId = projectId;
        this.status = status || 'enviado';
        this.date = date || new Date().toISOString().split('T')[0];
    }
}