import axios from "axios";
import { Storekeeper } from "../../models/Storekeeper";
import { API_URL } from "../../utils/config";
import { AuthService } from "../interfaces/IAuthService";
import { IStorekeeperService } from "../interfaces/IStorekeeperService";

export class StorekeeperService implements IStorekeeperService, AuthService<Storekeeper> {
    // Статичні URL-адреси для запитів до API
    private static STOREKEEPER_URLS = {
        GET_ALL: `${API_URL}/storekeeper`, // URL для отримання всіх комірників
        GET_BY_ID: (id: number) => `${API_URL}/storekeeper/${id}`, // URL для отримання комірника за ідентифікатором
        CREATE: `${API_URL}/storekeeper/create`, // URL для створення нового комірника
        DELETE: (id: number) => `${API_URL}/storekeeper/delete/${id}`, // URL для видалення комірника за ідентифікатором
        UPDATE: `${API_URL}/storekeeper/update`, // URL для оновлення комірника
        AUTHORIZE: `${API_URL}/storekeeper/authorize` // URL для авторизації комірника
    }

    // Метод для створення нового комірника
    async create(item: Storekeeper): Promise<Storekeeper> {
        const response = await axios.post<Storekeeper>(StorekeeperService.STOREKEEPER_URLS.CREATE, item);
        return response.data;
    }

    // Метод для видалення комірника за ідентифікатором
    async delete(itemId: number): Promise<void> {
        await axios.delete(StorekeeperService.STOREKEEPER_URLS.DELETE(itemId));
    }

    // Метод для оновлення існуючого комірника
    async update(item: Storekeeper): Promise<Storekeeper> {
        const response = await axios.put<Storekeeper>(StorekeeperService.STOREKEEPER_URLS.UPDATE, item);
        return response.data;
    }

    // Метод для отримання всіх комірників
    async getAll(): Promise<Storekeeper[]> {
        const response = await axios.get<Storekeeper[]>(StorekeeperService.STOREKEEPER_URLS.GET_ALL);
        return response.data;
    }

    // Метод для отримання комірника за ідентифікатором
    async getById(id: number): Promise<Storekeeper | null> {
        const response = await axios.get<Storekeeper | null>(StorekeeperService.STOREKEEPER_URLS.GET_BY_ID(id));
        return response.data;
    }

    // Метод для авторизації комірника
    async authorize(username: string, passwordHash: string): Promise<Storekeeper | null> {
        const response = await axios.post<Storekeeper | null>(StorekeeperService.STOREKEEPER_URLS.AUTHORIZE, { username: username, password_hash: passwordHash });
        return response.data;
    }
}
