export class Student {
    constructor({ id, userId, birthdate, city, country, field, phoneNumber, portfolioLink, aboutMe, rating, specializations,logo}) {
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
        this.specializations = specializations || [];
        this.logo = logo;
    }
}
