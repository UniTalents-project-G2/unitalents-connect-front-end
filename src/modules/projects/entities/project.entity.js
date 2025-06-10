export class Project {
    constructor({ id, title, description, companyId, studentSelected, isFinished }) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.companyId = companyId;
        this.studentSelected = studentSelected;
        this.isFinished = isFinished;
    }
}