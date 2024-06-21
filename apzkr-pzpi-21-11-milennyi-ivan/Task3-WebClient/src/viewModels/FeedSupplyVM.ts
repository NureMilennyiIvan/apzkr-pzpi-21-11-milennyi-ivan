import { timestampToDate } from "../utils/helpers";

// Клас для відображення поставок корму
export class FeedSupplyVM {
    id: number; // Ідентифікатор поставок корму
    amount: number; // Кількість корму в кг
    date: string; // Дата постачання
    storekeeperName: string | null; // Ім'я комірника
    storekeeperSurname: string | null; // Прізвище комірника

    constructor(id: number, amount: number, timestamp: number, storekeeperName: string | null, storekeeperSurname: string | null) {
        this.id = id;
        this.amount = amount / 1000;
        this.storekeeperName = storekeeperName;
        this.storekeeperSurname = storekeeperSurname;
        this.date = timestampToDate(timestamp);
    }
}
