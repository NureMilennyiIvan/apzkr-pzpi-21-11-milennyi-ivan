// Клас, що представляє корм
export class Feed {
    id: number | null; // Ідентифікатор корму
    amount: number; // Кількість корму
    name: string; // Назва корму
    calories: number; // Кількість калорій в кормі
    fat: number; // Кількість жиру в кормі
    protein: number; // Кількість білків в кормі
    carbohydrates: number; // Кількість вуглеводів в кормі

    constructor(id: number | null, amount: number, name: string, calories: number, fat: number, protein: number, carbohydrates: number) {
        this.id = id;
        this.amount = amount;
        this.name = name;
        this.calories = calories;
        this.fat = fat;
        this.protein = protein;
        this.carbohydrates = carbohydrates;
    }
}