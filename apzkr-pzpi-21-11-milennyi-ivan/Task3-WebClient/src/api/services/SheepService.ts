import axios from "axios";
import { Sheep } from "../../models/Sheep";
import { API_URL } from "../../utils/config";
import { SheepVM } from "../../viewModels/SheepVM";
import { SheepDetailsVM } from "../../viewModels/extraViewModels/SheepDetailsVM";
import { ISheepService } from "../interfaces/ISheepService";

export class SheepService implements ISheepService<SheepDetailsVM> {
    // Статичні URL-адреси для запитів до API
    private static SHEEP_URLS = {
        GET_ALL: `${API_URL}/sheep`, // URL для отримання всіх овець
        GET_BY_ID: (id: number) => `${API_URL}/sheep/${id}`, // URL для отримання вівці за ідентифікатором
        CREATE: `${API_URL}/sheep/create`, // URL для створення нової вівці
        DELETE: (id: number) => `${API_URL}/sheep/delete/${id}`, // URL для видалення вівці за ідентифікатором
        UPDATE: `${API_URL}/sheep/update`, // URL для оновлення вівці
        GET_ALL_VMS_BY_SHEPHERD_ID: (id: number) => `${API_URL}/sheep/shepherd/${id}`, // URL для отримання всіх моделей представлення овець за ідентифікатором пастуха
        GET_DETAILS_BY_ID: (id: number) => `${API_URL}/sheep/details/${id}`, // URL для отримання детальної інформації про вівцю за ідентифікатором
        CHANGE_SHEPHERD: (sheepId: number) => `${API_URL}/sheep/change-shepherd/${sheepId}`, // URL для зміни пастуха у вівці
        CHANGE_TEMPERATURE_SCANNER: (sheepId: number) => `${API_URL}/sheep/change-temperature-scanner/${sheepId}` // URL для зміни температурного сканера у вівці
    }

    // Метод для створення нової вівці
    async create(item: Sheep): Promise<Sheep> {
        const response = await axios.post<Sheep>(SheepService.SHEEP_URLS.CREATE, item);
        return response.data;
    }

    // Метод для видалення вівці за ідентифікатором
    async delete(itemId: number): Promise<void> {
        await axios.delete(SheepService.SHEEP_URLS.DELETE(itemId));
    }

    // Метод для оновлення існуючої вівці
    async update(item: Sheep): Promise<Sheep> {
        const response = await axios.put<Sheep>(SheepService.SHEEP_URLS.UPDATE, item);
        return response.data;
    }

    // Метод для отримання всіх овець
    async getAll(): Promise<Sheep[]> {
        const response = await axios.get<Sheep[]>(SheepService.SHEEP_URLS.GET_ALL);
        return response.data;
    }

    // Метод для отримання вівці за ідентифікатором
    async getById(id: number): Promise<Sheep | null> {
        const response = await axios.get<Sheep | null>(SheepService.SHEEP_URLS.GET_BY_ID(id));
        return response.data;
    }

    // Метод для отримання всіх моделей представлення овець за ідентифікатором пастуха
    async getAllVMsByShepherdId(id: number): Promise<SheepVM[]> {
        const response = await axios.get<[]>(SheepService.SHEEP_URLS.GET_ALL_VMS_BY_SHEPHERD_ID(id));
        const vms: SheepVM[] = [];
        response.data.map(sheep => {
            //@ts-ignore
            vms.push(new SheepVM(sheep.id, sheep.breed, sheep.sex, sheep.birth_date, sheep.last_feeding_timestamp, sheep.last_shearing_timestamp));
        });
        return vms;
    }

    // Метод для отримання детальної інформації про вівцю за ідентифікатором
    async getDetailsById(id: number): Promise<SheepDetailsVM | null> {
        const response = await axios.get(SheepService.SHEEP_URLS.GET_DETAILS_BY_ID(id));
        const sheepDetails = response.data;
        if (sheepDetails) {
            //@ts-ignore
            return new SheepDetailsVM(
                sheepDetails.id,
                sheepDetails.breed,
                sheepDetails.breed_info,
                sheepDetails.sex,
                sheepDetails.birth_date,
                sheepDetails.weight,
                sheepDetails.feed_id,
                sheepDetails.feed_name,
                sheepDetails.required_feed_amount,
                sheepDetails.available_feed_amount,
                sheepDetails.last_feeding_timestamp,
                sheepDetails.last_shearing_timestamp,
                sheepDetails.temperature
            );
        }
        return null;
    }

    // Метод для зміни пастуха у вівці
    async changeShepherd(sheepId: number, changeId: number | null): Promise<void> {
        await axios.patch<void>(SheepService.SHEEP_URLS.CHANGE_SHEPHERD(sheepId), { change_id: changeId });
    }

    // Метод для зміни температурного сканера у вівці
    async changeTemperatureScanner(sheepId: number, changeId: number | null): Promise<void> {
        await axios.patch<void>(SheepService.SHEEP_URLS.CHANGE_TEMPERATURE_SCANNER(sheepId), { change_id: changeId });
    }
}

