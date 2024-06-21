import { Shepherd } from "../../models/Shepherd";
import { ShepherdVM } from "../../viewModels/ShepherdVM";
import { IService } from "./IService";

// Інтерфейс для служби роботи з пастухами, що успадковує IService
export interface IShepherdService extends IService<Shepherd, ShepherdVM> {
    // Метод для отримання всіх моделей представлення пастухів
    getAllVMs(): Promise<ShepherdVM[]>;
}