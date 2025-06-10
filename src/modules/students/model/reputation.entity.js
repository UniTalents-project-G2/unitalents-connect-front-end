export class Reputation {
    constructor({
                    id,
                    studentId,
                    projectTitle,
                    companyName,
                    comment,
                    rating
                }) {
        this.id = id;
        this.studentId = studentId;
        this.projectTitle = projectTitle;
        this.companyName = companyName;
        this.comment = comment;
        this.rating = rating;
    }
}
