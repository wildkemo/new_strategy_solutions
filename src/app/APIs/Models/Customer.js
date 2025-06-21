const { DatabaseHandler } = require('./DatabaseHandler');
const User = require('./User');

class Customer extends User {
    constructor() {
        super();
        this.gender = null;
        this.phone = null;
        this.company_name = null;
    }

    getGender() {
        return this.gender;
    }

    setGender(gender) {
        this.gender = gender;
    }

    getPhone() {
        return this.phone;
    }

    setPhone(phone) {
        this.phone = phone;
    }

    getCompanyName() {
        return this.company_name;
    }

    setCompanyName(company_name) {
        this.company_name = company_name;
    }

    async addToDB(dbHandler) {
        const email = this.getEmail();
        const exists = await dbHandler.is_existing('customers', 'email', email);

        if (!exists) {
            const data = {
                'name': this.getName(),
                'email': this.getEmail(),
                'password': this.getPassword(), // No hashing
                'phone': this.getPhone(),
                'gender': this.getGender(),
                'company_name': this.getCompanyName()
            };

            const op = await dbHandler.insert('customers', data);

            if (op) {
                return 0;
            } else {
                return 1;
            }
        } else {
            return 2;
        }
    }
}

module.exports = Customer;