export class Company {
    constructor({ id, userId, companyName, sector, location, email, phone, rating, specializations, logo, description }) {
        this.id = id;
        this.userId = userId;
        this.companyName = companyName;
        this.sector = sector;
        this.location = location;
        this.email = email;
        this.phone = phone;
        this.rating = rating;
        this.specializations = specializations || [];
        this.logo = logo;
        this.description = description;
        //hello
    }
}
