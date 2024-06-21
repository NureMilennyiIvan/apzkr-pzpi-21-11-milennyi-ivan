import { Breed } from "../../models/Breed";
import { BreedVM } from "../../viewModels/BreedVM";
import { IService } from "./IService";

// Інтерфейс для служби роботи з породами, що успадковує IService
export interface IBreedService extends IService<Breed, BreedVM> {
    // Метод для отримання всіх моделей представлення порід
    getAllVMs(): Promise<BreedVM[]>;
}