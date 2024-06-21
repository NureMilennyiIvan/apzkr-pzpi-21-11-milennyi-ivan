import { ShearingLog } from "../../models/ShearingLog";
import { ShearingLogVM } from "../../viewModels/ShearingLogVM";
import { IService } from "./IService";

// Інтерфейс для служби роботи з записами стрижки, що успадковує IService
export interface IShearingLogService extends IService<ShearingLog, ShearingLogVM> {
    // Метод для отримання всіх записів стрижки за ідентифікатором вівці
    getAllVMsBySheepId(id: number): Promise<ShearingLogVM[]>;
}