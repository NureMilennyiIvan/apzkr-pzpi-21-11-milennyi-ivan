import { FeedingLog } from "../../models/FeedingLog";
import { FeedingLogVM } from "../../viewModels/FeedingLogVM";
import { IService } from "./IService";

// Інтерфейс для служби роботи з записами годування, що успадковує IService
export interface IFeedingLogService extends IService<FeedingLog, FeedingLogVM> {
    // Метод для отримання всіх записів годування за ідентифікатором вівці
    getAllVMsBySheepId(id: number): Promise<FeedingLogVM[]>;
    // Метод для отримання всіх записів годування за ідентифікатором корму
    getAllVMsByFeedId(id: number): Promise<FeedingLogVM[]>;
}