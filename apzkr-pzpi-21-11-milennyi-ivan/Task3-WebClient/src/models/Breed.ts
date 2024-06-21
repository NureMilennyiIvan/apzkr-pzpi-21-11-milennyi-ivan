// Клас, що представляє породу
export class Breed {
    id: number | null; // Ідентифікатор породи
    name: string; // Назва породи
    feed_id: number; // Ідентифікатор корму, що використовується для породи
    info: string; // Додаткова інформація про породу

    constructor(id: number | null, name: string, feedId: number, info: string) {
        this.id = id;
        this.name = name;
        this.feed_id = feedId;
        this.info = info;
    }
}