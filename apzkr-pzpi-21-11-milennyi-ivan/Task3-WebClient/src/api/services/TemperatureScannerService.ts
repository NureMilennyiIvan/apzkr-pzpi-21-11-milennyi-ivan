import axios from "axios";
import { TemperatureScanner } from "../../models/TemperatureScanner";
import { API_URL } from "../../utils/config";
import { ITemperatureScannerService } from "../interfaces/ITemperatureScannerService";

export class TemperatureScannerService implements ITemperatureScannerService {

    // Статичні URL-адреси для запитів до API
    private static TEMPERATURE_SCANNER_URLS = {
        GET_ALL: `${API_URL}/temperature-scanner`, // URL для отримання всіх температурних сканерів
        GET_BY_ID: (id: number) => `${API_URL}/temperature-scanner/${id}`, // URL для отримання температурного сканера за ідентифікатором
        CREATE: `${API_URL}/temperature-scanner/create`, // URL для створення нового температурного сканера
        DELETE: (id: number) => `${API_URL}/temperature-scanner/delete/${id}`, // URL для видалення температурного сканера за ідентифікатором
        UPDATE: `${API_URL}/temperature-scanner/update`, // URL для оновлення температурного сканера
        GET_All_UNASSIGNED_SCANNERS_IDS: `${API_URL}/temperature-scanner-all-unassigned-ids` // URL для отримання всіх незакріплених ідентифікаторів температурних сканерів
    }

    // Метод для створення нового температурного сканера
    async create(item: TemperatureScanner): Promise<TemperatureScanner> {
        const response = await axios.post<TemperatureScanner>(TemperatureScannerService.TEMPERATURE_SCANNER_URLS.CREATE, item);
        return response.data;
    }

    // Метод для видалення температурного сканера за ідентифікатором
    async delete(itemId: number): Promise<void> {
        await axios.delete(TemperatureScannerService.TEMPERATURE_SCANNER_URLS.DELETE(itemId));
    }

    // Метод для оновлення існуючого температурного сканера
    async update(item: TemperatureScanner): Promise<TemperatureScanner> {
        const response = await axios.put<TemperatureScanner>(TemperatureScannerService.TEMPERATURE_SCANNER_URLS.UPDATE, item);
        return response.data;
    }

    // Метод для отримання всіх температурних сканерів
    async getAll(): Promise<TemperatureScanner[]> {
        const response = await axios.get<TemperatureScanner[]>(TemperatureScannerService.TEMPERATURE_SCANNER_URLS.GET_ALL);
        return response.data;
    }

    // Метод для отримання температурного сканера за ідентифікатором
    async getById(id: number): Promise<TemperatureScanner | null> {
        const response = await axios.get<TemperatureScanner | null>(TemperatureScannerService.TEMPERATURE_SCANNER_URLS.GET_BY_ID(id));
        return response.data;
    }

    // Метод для отримання всіх незакріплених ідентифікаторів температурних сканерів
    async getAllUnassignedScannersIds(): Promise<number[]> {
        const response = await axios.get<number[]>(TemperatureScannerService.TEMPERATURE_SCANNER_URLS.GET_All_UNASSIGNED_SCANNERS_IDS);
        return response.data;
    }
}
