
export class StudentModel {
    id: string;
    name: string;
    phone: string;
    skype: string;
    email: string;

    constructor(id: string, name: string, phone?: string, skype?: string, email?: string) {
        this.id = id;
        this.name = name;
        this.phone = phone;
        this.skype = skype;
        this.email = email;
    }
}