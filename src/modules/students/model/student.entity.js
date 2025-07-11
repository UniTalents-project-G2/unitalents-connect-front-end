// student.entity.js
export class Student {
    constructor({
                    id = null,
                    userId = null,
                    birthdate = '',
                    city = '',
                    country = '',
                    field = '',
                    phoneNumber = '',
                    portfolioLink = '',
                    aboutMe = '',
                    rating = 0,
                    specializations = [],
                    logo = '',
                    endedProjects = [] // ✅ nuevo campo agregado
                } = {}) {
        this.id = id;
        this.userId = userId;
        this.birthdate = birthdate;
        this.city = city;
        this.country = country;
        this.field = field;
        this.phoneNumber = phoneNumber;
        this.portfolioLink = portfolioLink;
        this.aboutMe = aboutMe;
        this.rating = rating;
        this.specializations = specializations;
        this.logo = logo;
        this.endedProjects = endedProjects;
    }
}
