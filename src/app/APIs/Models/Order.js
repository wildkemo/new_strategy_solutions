const { DatabaseHandler } = require('./DatabaseHandler');
const Customer = require('./Customer');

class Order extends Customer {
    constructor() {
        super();
        this.service_type = null;
        this.service_description = null;
        this.status = null;
    }

    getServiceType() {
        return this.service_type;
    }

    setServiceType(service_type) {
        this.service_type = service_type;
    }

    getServiceDescription() {
        return this.service_description;
    }

    setServiceDescription(service_description) {
        this.service_description = service_description;
    }

    getStatus() {
        return this.status;
    }

    setStatus(status) {
        this.status = status;
    }

    async addToDB(dbHandler) {
        const email = this.getEmail();
        const exists = await dbHandler.is_existing('orders', 'email', email);

        if (!exists) {
            const data = {
                'name': this.getName(),
                'email': this.getEmail(),
                'password': this.getPassword(), // No hashing
                'phone': this.getPhone(),
                'gender': this.getGender(),
                'company_name': this.getCompanyName(),
                'service_type': this.getServiceType(),
                'service_description': this.getServiceDescription(),
                'status': this.getStatus()
            };

            const op = await dbHandler.insert('orders', data);

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

module.exports = Order;