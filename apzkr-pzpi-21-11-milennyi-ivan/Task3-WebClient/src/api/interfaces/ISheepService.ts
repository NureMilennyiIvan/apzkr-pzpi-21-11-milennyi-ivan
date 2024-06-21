import { Sheep } from "../../models/Sheep";
import { SheepVM } from "../../viewModels/SheepVM";
import { IService } from "./IService";

// Інтерфейс для служби роботи з вівцями, що успадковує IService
export interface ISheepService<DetailsViewModel> extends IService<Sheep, SheepVM> {
    // Метод для отримання всіх моделей представлення овець за ідентифікатором пастуха
    getAllVMsByShepherdId(id: number): Promise<SheepVM[]>;
    // Метод для отримання детальної інформації про вівцю за ідентифікатором
    getDetailsById(id: number): Promise<DetailsViewModel | null>;
    // Метод для зміни пастуха у вівці
    changeShepherd(sheepId: number, changeId: number | null): Promise<void>;
    // Метод для зміни температурного сканера у вівці
    changeTemperatureScanner(sheepId: number, changeId: number | null): Promise<void>;
}