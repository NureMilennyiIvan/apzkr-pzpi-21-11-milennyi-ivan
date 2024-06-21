
// Клас, що представляє пастуха
export class Shepherd {
    id: number | null; // Ідентифікатор пастуха
    username: string; // Ім'я користувача пастуха
    password: string; // Пароль пастуха
    name: string; // Ім'я пастуха
    surname: string; // Прізвище пастуха

    constructor(id: number | null, username: string, password: string, name: string, surname: string) {
        this.id = id;
        this.username = username;
        this.password = password;
        this.name = name;
        this.surname = surname;
    }
}