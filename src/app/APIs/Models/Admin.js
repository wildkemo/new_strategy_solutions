const { DatabaseHandler } = require('./DatabaseHandler');
const User = require('./User');

class Admin extends User {
    constructor() {
        super();
        this.role = null;
    }

    getRole() {
        return this.role;
    }

    setRole(role) {
        this.role = role;
    }

    async addToDB(dbHandler) {
        const email = this.getEmail();
        const exists = await dbHandler.is_existing('admins', 'email', email);

        if (exists) {
            const fetchedrole = await dbHandler.getOneValue('admins', 'role', 'email', email);
            this.setRole(fetchedrole);

            const data = {
                'name': this.getName(),
                'email': this.getEmail(),
                'role': this.getRole()
            };

            const op = await dbHandler.insert('admins', data);

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

module.exports = Admin;