class Customer extends User {
    constructor() {
        super();
        this.gender = null;
        this.phone = null;
        this.company_name = null;
    }

    getCompanyName() {
        return this.company_name;
    }

    setCompanyName(company_name) {
        this.company_name = company_name;
    }

    getPhone() {
        return this.phone;
    }

    setPhone(phone) {
        this.phone = phone;
    }

    getGender() {
        return this.gender;
    }

    setGender(gender) {
        this.gender = gender;
    }

    addToDB(dbHandler) {
        const email = this.getEmail();
        const exists = dbHandler.isExisting("customers", "email", email);

        if (!exists) {
            const data = {
                name: this.getName(),
                email: this.getEmail(),
                password: this.getPassword(),
                phone: this.getPhone(),
                gender: this.getGender(),
                company_name: this.getCompanyName()
            };

            const op = dbHandler.insert('customers', data);

            if (op === true) {
                return 0;
            } else {
                return 1;
            }
        } else {
            return 2;
        }
    }
}