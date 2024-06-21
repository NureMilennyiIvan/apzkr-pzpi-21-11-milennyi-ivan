
import { Storekeeper } from "../../models/Storekeeper";
import { StorekeeperVM } from "../../viewModels/StorekeeperVM";
import { IService } from "./IService";

// Інтерфейс для служби роботи з комірниками, що успадковує IService
export interface IStorekeeperService extends IService<Storekeeper, StorekeeperVM> {

}