import { UserRole } from "./UserRole";

export class AuthUser {
    // Приватні поля для зберігання ідентифікатора користувача та його ролі
    private id: number | null;
    private role: UserRole;

    // Геттер для отримання ідентифікатора користувача
    public get Id(): number | null {
        return this.id;
    }

    // Сеттер для встановлення ідентифікатора користувача
    public set Id(value: number | null) {
        this.id = value;
    }

    // Геттер для отримання ролі користувача
    public get Role(): UserRole {
        return this.role;
    }

    // Сеттер для встановлення ролі користувача
    public set Role(role: UserRole) {
        this.role = role;
    }

    // Конструктор для ініціалізації ідентифікатора користувача та його ролі
    constructor(id: number | null = null, role: UserRole) {
        this.id = id;
        this.role = role;
    }
}
