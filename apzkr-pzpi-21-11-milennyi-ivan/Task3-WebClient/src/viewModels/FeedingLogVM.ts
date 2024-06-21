import { timestampToDate } from "../utils/helpers";

// Клас для відображення записів годування
export class FeedingLogVM {
    id: number; // Ідентифікатор запису годування
    date: string; // Дата годування
    amount: number; // Кількість корму в кг
    shepherdName: string | null; // Ім'я пастуха
    shepherdSurname: string | null; // Прізвище пастуха
    sheepId: number; // Ідентифікатор вівці

    constructor(id: number, timestamp: number, amount: number, sheepId: number, shepherdName: string | null, shepherdSurname: string | null) {
        this.id = id;
        this.amount = amount / 1000;
        this.shepherdName = shepherdName;
        this.shepherdSurname = shepherdSurname;
        this.sheepId = sheepId;
        this.date = timestampToDate(timestamp);
    }
}