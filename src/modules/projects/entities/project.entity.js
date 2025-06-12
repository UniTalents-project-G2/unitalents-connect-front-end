export class Project {
    constructor({
                    id,
                    title,
                    description,
                    companyId,
                    studentSelected,
                    isFinished,
                    postulants = [],
                    field,
                    skills = [],
                    status // Nuevo campo
                }) {
        this.id = id
        this.title = title
        this.description = description
        this.companyId = companyId
        this.studentSelected = studentSelected
        this.isFinished = isFinished
        this.postulants = postulants
        this.field = field
        this.skills = skills
        this.status = status || this.calculateStatus()
    }

    calculateStatus() {
        if (this.isFinished) return 'Finalizado'
        if (this.studentSelected) return 'En curso'
        return 'Pendiente'
    }
}