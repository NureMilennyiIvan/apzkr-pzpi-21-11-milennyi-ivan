// Клас, що представляє поставки корму
export class FeedSupply {
    id: number | null; // Ідентифікатор поставки корму
    storekeeper_id: number | null; // Ідентифікатор комірника
    amount: number; // Кількість корму
    timestamp: number; // Час поставки у секундах
    feed_id: number; // Ідентифікатор корму

    constructor(id: number | null, storekeeperId: number | null, amount: number, timestamp: number, feedId: number) {
        this.id = id;
        this.storekeeper_id = storekeeperId;
        this.amount = amount;
        this.timestamp = Math.floor(timestamp / 1000);
        this.feed_id = feedId;
    }
}
