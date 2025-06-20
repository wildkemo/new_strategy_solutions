class Service {
    constructor() {
        this.title = null;
        this.description = null;
        this.category = null;
        this.features = null;
        this.icon = null;
        this.service_status = null;
    }

    getTitle() {
        return this.title;
    }

    setTitle(title) {
        this.title = title;
    }

    getDescription() {
        return this.description;
    }

    setDescription(description) {
        this.description = description;
    }

    getCategory() {
        return this.category;
    }

    setCategory(category) {
        this.category = category;
    }

    getFeatures() {
        return this.features;
    }

    setFeatures(features) {
        this.features = features;
    }

    getIcon() {
        return this.icon;
    }

    setIcon(icon) {
        this.icon = icon;
    }

    addToDB(dbHandler) {
        const title = this.getTitle();
        const exists = dbHandler.isExisting("services", "title", title);

        if (!exists) {
            const data = {
                title: this.getTitle(),
                description: this.getDescription(),
                category: this.getCategory(),
                features: this.getFeatures(),
                icon: this.getIcon()
            };

            const op = dbHandler.insert('services', data);

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