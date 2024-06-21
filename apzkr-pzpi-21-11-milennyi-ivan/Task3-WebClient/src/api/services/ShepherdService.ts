import axios from "axios";
import { Shepherd } from "../../models/Shepherd";
import { API_URL } from "../../utils/config";
import { AuthService } from "../interfaces/IAuthService";
import { IShepherdService } from "../interfaces/IShepherdService";
import { ShepherdVM } from "../../viewModels/ShepherdVM";

export class ShepherdService implements IShepherdService, AuthService<Shepherd> {

    // Статичні URL-адреси для запитів до API
    private static SHEPHERD_URLS = {
        GET_ALL: `${API_URL}/shepherd`, // URL для отримання всіх пастухів
        GET_BY_ID: (id: number) => `${API_URL}/shepherd/${id}`, // URL для отримання пастуха за ідентифікатором
        CREATE: `${API_URL}/shepherd/create`, // URL для створення нового пастуха
        DELETE: (id: number) => `${API_URL}/shepherd/delete/${id}`, // URL для видалення пастуха за ідентифікатором
        UPDATE: `${API_URL}/shepherd/update`, // URL для оновлення пастуха
        AUTHORIZE: `${API_URL}/shepherd/authorize`, // URL для авторизації пастуха
        GET_ALL_VMS: `${API_URL}/shepherd-vms` // URL для отримання всіх моделей представлення пастухів
    }

    // Метод для створення нового пастуха
    async create(item: Shepherd): Promise<Shepherd> {
        const response = await axios.post<Shepherd>(ShepherdService.SHEPHERD_URLS.CREATE, item);
        return response.data;
    }

    // Метод для видалення пастуха за ідентифікатором
    async delete(itemId: number): Promise<void> {
        await axios.delete(ShepherdService.SHEPHERD_URLS.DELETE(itemId));
    }

    // Метод для оновлення існуючого пастуха
    async update(item: Shepherd): Promise<Shepherd> {
        const response = await axios.put<Shepherd>(ShepherdService.SHEPHERD_URLS.UPDATE, item);
        return response.data;
    }

    // Метод для отримання всіх пастухів
    async getAll(): Promise<Shepherd[]> {
        const response = await axios.get<Shepherd[]>(ShepherdService.SHEPHERD_URLS.GET_ALL);
        return response.data;
    }

    // Метод для отримання пастуха за ідентифікатором
    async getById(id: number): Promise<Shepherd | null> {
        const response = await axios.get<Shepherd | null>(ShepherdService.SHEPHERD_URLS.GET_BY_ID(id));
        return response.data;
    }

    // Метод для отримання всіх моделей представлення пастухів
    async getAllVMs(): Promise<ShepherdVM[]> {
        const response = await axios.get<ShepherdVM[]>(ShepherdService.SHEPHERD_URLS.GET_ALL_VMS);
        return response.data;
    }

    // Метод для авторизації пастуха
    async authorize(username: string, passwordHash: string): Promise<Shepherd | null> {
        const response = await axios.post<Shepherd | null>(ShepherdService.SHEPHERD_URLS.AUTHORIZE, { username: username, password_hash: passwordHash });
        return response.data;
    }
}
