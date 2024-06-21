import { AuthUser } from "../../utils/AuthUser";

// Інтерфейс для пропсів користувача
export interface IUserProps {
    user: AuthUser; // Об'єкт авторизованого користувача
    setUser: React.Dispatch<React.SetStateAction<AuthUser>>; // Функція для оновлення стану користувача
}
