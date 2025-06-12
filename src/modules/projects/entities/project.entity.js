export class Project {
    constructor({ id, title, description, companyId, studentSelected, isFinished, postulants = [], field, budget, createdAt }) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.companyId = companyId;
        this.studentSelected = studentSelected;
        this.isFinished = isFinished;
        this.postulants = postulants;
        this.field = field;
        this.budget = budget;
        this.createdAt = createdAt;
    }
}

