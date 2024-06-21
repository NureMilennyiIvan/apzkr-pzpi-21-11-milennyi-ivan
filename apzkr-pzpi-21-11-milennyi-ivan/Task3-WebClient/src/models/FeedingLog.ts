// Клас, що представляє запис годування
export class FeedingLog {
    id: number | null; // Ідентифікатор запису годування
    sheep_id: number; // Ідентифікатор вівці
    shepherd_id: number | null; // Ідентифікатор пастуха
    timestamp: number; // Час годування у секундах
    feed_id: number; // Ідентифікатор корму
    amount: number; // Кількість корму

    constructor(id: number | null, sheepId: number, shepherdId: number | null, timestamp: number, feedId: number, amount: number) {
        this.id = id;
        this.sheep_id = sheepId;
        this.shepherd_id = shepherdId;
        this.timestamp = Math.floor(timestamp / 1000);
        this.feed_id = feedId;
        this.amount = amount;
    }
}