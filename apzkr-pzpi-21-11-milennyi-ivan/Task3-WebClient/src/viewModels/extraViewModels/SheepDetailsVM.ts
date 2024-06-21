import { timeInDays, timestampToDate } from "../../utils/helpers";

// Клас для відображення деталей про вівцю
export class SheepDetailsVM {
    id: number; // Ідентифікатор вівці
    breed: string; // Порода вівці
    breedInfo: string; // Інформація про породу
    sex: boolean; // Стать вівці (true - самець, false - самка)
    age: number; // Вік вівці в днях
    lastFeedingDate: string | null; // Дата останнього годування
    lastShearingDate: string | null; // Дата останньої стрижки
    weight: number; // Вага вівці в кг
    temperature: number | null; // Температура вівці
    feedId: number; // Ідентифікатор корму
    feedName: string; // Назва корму
    requiredFeedAmount: number; // Необхідна кількість корму в кг
    availableFeedAmount: number; // Доступна кількість корму в кг
    isFeed: boolean; // Чи потрібно годувати вівцю
    isShear: boolean; // Чи потрібно стригти вівцю

    constructor(
        id: number,
        breed: string,
        breedInfo: string,
        sex: boolean,
        birthDate: number,
        weight: number,
        feedId: number,
        feedName: string,
        requiredFeedAmount: number,
        availableFeedAmount: number,
        lastFeedingTimestamp: number | null,
        lastShearingTimestamp: number | null,
        temperature: number | null
    ) {
        this.id = id;
        this.breed = breed;
        this.breedInfo = breedInfo;
        this.sex = sex;
        this.age = timeInDays(birthDate);
        this.weight = weight / 1000;
        this.feedId = feedId;
        this.feedName = feedName;
        this.requiredFeedAmount = requiredFeedAmount / 1000;
        this.availableFeedAmount = availableFeedAmount / 1000;
        this.lastFeedingDate = (lastFeedingTimestamp != null) ? timestampToDate(lastFeedingTimestamp) : null;
        this.lastShearingDate = (lastShearingTimestamp != null) ? timestampToDate(lastShearingTimestamp) : null;
        this.temperature = (temperature != null) ? temperature / 10 : null;
        this.isFeed = (timeInDays(lastFeedingTimestamp) > 0) ? true : false;
        this.isShear = (timeInDays(lastShearingTimestamp) >= 30) ? true : false;
    }
}