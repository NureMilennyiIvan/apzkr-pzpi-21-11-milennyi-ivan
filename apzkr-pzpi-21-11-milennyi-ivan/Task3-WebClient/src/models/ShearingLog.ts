// Клас, що представляє запис стрижки
export class ShearingLog {
    id: number | null; // Ідентифікатор запису стрижки
    sheep_id: number; // Ідентифікатор вівці
    shepherd_id: number | null; // Ідентифікатор пастуха
    timestamp: number; // Час стрижки у секундах
    wool_amount: number; // Кількість вовни

    constructor(id: number | null, sheepId: number, shepherdId: number | null, timestamp: number, woolAmount: number) {
        this.id = id;
        this.sheep_id = sheepId;
        this.shepherd_id = shepherdId;
        this.timestamp = Math.floor(timestamp / 1000);
        this.wool_amount = woolAmount;
    }
}
