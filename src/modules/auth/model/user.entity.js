export class User {
    constructor({ id, email, password, role, name }) {
        this.id = id;
        this.email = email;
        this.password = password;
        this.role = role;
        this.name = name;
    }

    isStudent() {
        return this.role === 'student';
    }

    isManager() {
        return this.role === 'manager';
    }


}
