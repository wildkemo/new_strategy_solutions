class Order {
    constructor() {
        this.name = null;
        this.email = null;
        this.service_type = null;
        this.service_description = null;
        this.company_name = null;
    }

    getCompanyName() {
        return this.company_name;
    }

    setCompanyName(company_name) {
        this.company_name = company_name;
    }

    getName() {
        return this.name;
    }

    setName(name) {
        this.name = name;
    }

    getEmail() {
        return this.email;
    }

    setEmail(email) {
        this.email = email;
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

    addToDB(dbHandler) {
        const exists = dbHandler.isExisting("customers", "email", this.getEmail());

        if (exists === true) {
            const fetchedname = dbHandler.getOneValue("customers", "name", "email", this.getEmail());
            const fetchedCompanyName = dbHandler.getOneValue("customers", "company_name", "email", this.getEmail());
            this.setName(fetchedname);
            this.setCompanyName(fetchedCompanyName);

            const data = {
                name: this.getName(),
                email: this.getEmail(),
                service_description: this.getServiceDescription(),
                service_type: this.getServiceType(),
                status: 'Pending',
                company_name: this.getCompanyName()
            };

            const op = dbHandler.insert('orders', data);

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