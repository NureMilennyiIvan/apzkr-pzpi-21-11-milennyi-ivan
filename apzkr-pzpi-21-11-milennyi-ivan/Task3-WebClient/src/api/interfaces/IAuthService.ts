// Інтерфейс для служби авторизації
export interface AuthService<Client> {
    // Метод для авторизації користувача за ім'ям користувача та хешем пароля
    authorize(username: string, passwordHash: string): Promise<Client | null>;
}