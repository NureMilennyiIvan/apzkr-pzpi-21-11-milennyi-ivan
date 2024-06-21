// Клас, що представляє температурний сканер
export class TemperatureScanner {
    id: number | null; // Ідентифікатор сканера
    temperature: number; // Температура, що вимірюється сканером
    password: string; // Пароль для доступу до сканера

    constructor(id: number | null, temperature: number, password: string) {
        this.id = id;
        this.temperature = temperature;
        this.password = password;
    }
}