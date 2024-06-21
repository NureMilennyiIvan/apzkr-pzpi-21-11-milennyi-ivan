import { timestampToDate } from "../utils/helpers";

// Клас для відображення записів стрижки
export class ShearingLogVM {
    id: number; // Ідентифікатор запису стрижки
    date: string; // Дата стрижки
    woolAmount: number; // Кількість вовни в кг
    shepherdName: string | null; // Ім'я пастуха
    shepherdSurname: string | null; // Прізвище пастуха
    sheepId: number; // Ідентифікатор вівці

    constructor(id: number, timestamp: number, woolAmount: number, sheepId: number, shepherdName: string | null, shepherdSurname: string | null) {
        this.id = id;
        this.woolAmount = woolAmount / 1000;
        this.shepherdName = shepherdName;
        this.shepherdSurname = shepherdSurname;
        this.sheepId = sheepId;
        this.date = timestampToDate(timestamp);
    }
}