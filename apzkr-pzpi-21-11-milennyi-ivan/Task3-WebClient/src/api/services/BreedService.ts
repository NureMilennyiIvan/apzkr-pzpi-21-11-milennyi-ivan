import { Breed } from "../../models/Breed";
import { API_URL } from "../../utils/config";
import { BreedVM } from "../../viewModels/BreedVM";
import { IBreedService } from "../interfaces/IBreedService";
import axios from "axios";

export class BreedService implements IBreedService {
    // Статичні URL-адреси для запитів до API
    private static BREED_URLS = {
        GET_ALL: `${API_URL}/breed`, // URL для отримання всіх порід
        GET_BY_ID: (id: number) => `${API_URL}/breed/${id}`, // URL для отримання породи за ідентифікатором
        CREATE: `${API_URL}/breed/create`, // URL для створення нової породи
        DELETE: (id: number) => `${API_URL}/breed/delete/${id}`, // URL для видалення породи за ідентифікатором
        UPDATE: `${API_URL}/breed/update`, // URL для оновлення породи
        GET_ALL_VMS: `${API_URL}/breed-vms` // URL для отримання всіх моделей представлення порід
    }

    // Метод для створення нової породи
    async create(item: Breed): Promise<Breed> {
        const response = await axios.post<Breed>(BreedService.BREED_URLS.CREATE, item);
        return response.data;
    }

    // Метод для видалення породи за ідентифікатором
    async delete(itemId: number): Promise<void> {
        await axios.delete(BreedService.BREED_URLS.DELETE(itemId));
    }

    // Метод для оновлення існуючої породи
    async update(item: Breed): Promise<Breed> {
        const response = await axios.put<Breed>(BreedService.BREED_URLS.UPDATE, item);
        return response.data;
    }

    // Метод для отримання всіх порід
    async getAll(): Promise<Breed[]> {
        const response = await axios.get<Breed[]>(BreedService.BREED_URLS.GET_ALL);
        return response.data;
    }

    // Метод для отримання породи за ідентифікатором
    async getById(id: number): Promise<Breed | null> {
        const response = await axios.get<Breed | null>(BreedService.BREED_URLS.GET_BY_ID(id));
        return response.data;
    }

    // Метод для отримання всіх моделей представлення порід
    async getAllVMs(): Promise<BreedVM[]> {
        const response = await axios.get<[]>(BreedService.BREED_URLS.GET_ALL_VMS);
        const vms: BreedVM[] = [];
        response.data.map(breed => {
            //@ts-ignore
            vms.push(new BreedVM(breed.id, breed.name, breed.info, breed.feed_name, breed.sheep_count));
        });
        return vms;
    }
}