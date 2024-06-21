import { FeedSupply } from "../../models/FeedSupply";
import { FeedSupplyVM } from "../../viewModels/FeedSupplyVM";
import { IService } from "./IService";

// Інтерфейс для служби поставок кормів, що успадковує IService
export interface IFeedSupplyService extends IService<FeedSupply, FeedSupplyVM> {
    // Метод для отримання всіх моделей представлення поставок кормів
    getAllVMs(): Promise<FeedSupplyVM[]>;
}