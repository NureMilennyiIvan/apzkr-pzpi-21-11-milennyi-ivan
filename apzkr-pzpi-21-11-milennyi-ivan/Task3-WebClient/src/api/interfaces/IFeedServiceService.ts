import { Feed } from "../../models/Feed";
import { FeedVM } from "../../viewModels/FeedVM";
import { IService } from "./IService";

// Інтерфейс для служби роботи з кормами, що успадковує IService
export interface IFeedService extends IService<Feed, FeedVM> {
    // Метод для отримання всіх моделей представлення кормів
    getAllVMs(): Promise<FeedVM[]>;
}