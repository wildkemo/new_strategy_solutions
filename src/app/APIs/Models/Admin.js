class Admin extends User {
    constructor() {
        super();
        this.level = null;
    }

    getLevel() {
        return this.level;
    }

    setLevel(level) {
        this.level = level;
    }

    addToDB(dbHandler) {
        const exists = dbHandler.isExisting("admins", "email", this.getEmail());

        if (!exists) {
            const data = {
                name: this.getName(),
                email: this.getEmail(),
                password: this.getPassword(),
                level: this.getLevel()
            };

            const op = dbHandler.insert('admins', data);

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