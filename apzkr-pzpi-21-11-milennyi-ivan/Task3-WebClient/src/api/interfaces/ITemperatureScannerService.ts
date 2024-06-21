import { TemperatureScanner } from "../../models/TemperatureScanner";
import { TemperatureScannerVM } from "../../viewModels/TemperautreScannerVM";
import { IService } from "./IService";


// Інтерфейс для служби роботи з температурними сканерами, що успадковує IService
export interface ITemperatureScannerService extends IService<TemperatureScanner, TemperatureScannerVM> {
    // Метод для отримання всіх ідентифікаторів незакріплених температурних сканерів
    getAllUnassignedScannersIds(): Promise<number[]>
}