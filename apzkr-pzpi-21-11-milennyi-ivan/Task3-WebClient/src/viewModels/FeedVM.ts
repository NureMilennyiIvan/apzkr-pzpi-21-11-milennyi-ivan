// Клас для відображення інформації про корм
export class FeedVM {
    id: number; // Ідентифікатор корму
    amount: number; // Кількість корму в кг
    name: string; // Назва корму
    calories: number; // Кількість калорій
    fat: number; // Кількість жиру
    protein: number; // Кількість білків
    carbohydrates: number; // Кількість вуглеводів
    breedName: string | null; // Назва породи, для якої призначений корм
    sheepCount: number; // Кількість овець, які споживають цей корм

    constructor(id: number, amount: number, name: string, calories: number, fat: number, protein: number, carbohydrates: number, breedName: string | null, sheepCount: number) {
        this.id = id;
        this.amount = amount / 1000;
        this.name = name;
        this.calories = calories;
        this.fat = fat;
        this.protein = protein;
        this.carbohydrates = carbohydrates;
        this.breedName = breedName;
        this.sheepCount = sheepCount;
    }
}