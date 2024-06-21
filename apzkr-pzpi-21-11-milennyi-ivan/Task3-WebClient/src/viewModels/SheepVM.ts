import { timestampToDate } from "../utils/helpers";

// Клас для відображення інформації про вівцю
export class SheepVM {
    id: number; // Ідентифікатор вівці
    breed: string; // Порода вівці
    sex: boolean; // Стать вівці (true - самець, false - самка)
    birthDate: number; // Дата народження вівці
    lastFeedingDate: string | null; // Дата останнього годування
    lastShearingDate: string | null; // Дата останньої стрижки

    constructor(id: number, breed: string, sex: boolean, birthDate: number, lastFeedingTimestamp: number | null, lastShearingTimestamp: number | null) {
        this.id = id;
        this.breed = breed;
        this.sex = sex;
        this.birthDate = birthDate;
        this.lastFeedingDate = (lastFeedingTimestamp != null) ? timestampToDate(lastFeedingTimestamp) : null;
        this.lastShearingDate = (lastShearingTimestamp != null) ? timestampToDate(lastShearingTimestamp) : null;
    }
}
