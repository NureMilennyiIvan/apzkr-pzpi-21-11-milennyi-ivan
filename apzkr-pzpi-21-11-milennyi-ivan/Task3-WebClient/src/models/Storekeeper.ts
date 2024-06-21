// Клас, що представляє комірника
export class Storekeeper {
    id: number | null; // Ідентифікатор комірника
    username: string; // Ім'я користувача комірника
    password: string; // Пароль комірника
    name: string; // Ім'я комірника
    surname: string; // Прізвище комірника

    constructor(id: number | null, username: string, password: string, name: string, surname: string) {
        this.id = id;
        this.username = username;
        this.password = password;
        this.name = name;
        this.surname = surname;
    }
}