import axios from "axios";
import { ShearingLog } from "../../models/ShearingLog";
import { API_URL } from "../../utils/config";
import { ShearingLogVM } from "../../viewModels/ShearingLogVM";
import { IShearingLogService } from "../interfaces/IShearingLogService";

export class ShearingLogService implements IShearingLogService {
    // Статичні URL-адреси для запитів до API
    private static SHEARING_LOG_URLS = {
        GET_ALL: `${API_URL}/shearing-log`, // URL для отримання всіх записів стрижки
        GET_BY_ID: (id: number) => `${API_URL}/shearing-log/${id}`, // URL для отримання запису стрижки за ідентифікатором
        CREATE: `${API_URL}/shearing-log/create`, // URL для створення нового запису стрижки
        DELETE: (id: number) => `${API_URL}/shearing-log/delete/${id}`, // URL для видалення запису стрижки за ідентифікатором
        GET_ALL_VMS_BY_SHEEP_ID: (id: number) => `${API_URL}/shearing-log/sheep/${id}` // URL для отримання всіх моделей представлення записів стрижки за ідентифікатором вівці
    }

    // Метод для створення нового запису стрижки
    async create(item: ShearingLog): Promise<ShearingLog> {
        const response = await axios.post<ShearingLog>(ShearingLogService.SHEARING_LOG_URLS.CREATE, item);
        return response.data;
    }

    // Метод для видалення запису стрижки за ідентифікатором
    async delete(itemId: number): Promise<void> {
        await axios.delete(ShearingLogService.SHEARING_LOG_URLS.DELETE(itemId));
    }

    // Метод для оновлення існуючого запису стрижки (заборонений)
    async update(_item: ShearingLog): Promise<ShearingLog> {
        throw new Error("Method is forbidden.");
    }

    // Метод для отримання всіх записів стрижки
    async getAll(): Promise<ShearingLog[]> {
        const response = await axios.get<ShearingLog[]>(ShearingLogService.SHEARING_LOG_URLS.GET_ALL);
        return response.data;
    }

    // Метод для отримання запису стрижки за ідентифікатором
    async getById(id: number): Promise<ShearingLog | null> {
        const response = await axios.get<ShearingLog | null>(ShearingLogService.SHEARING_LOG_URLS.GET_BY_ID(id));
        return response.data;
    }

    // Метод для отримання всіх моделей представлення записів стрижки за ідентифікатором вівці
    async getAllVMsBySheepId(id: number): Promise<ShearingLogVM[]> {
        const response = await axios.get<[]>(ShearingLogService.SHEARING_LOG_URLS.GET_ALL_VMS_BY_SHEEP_ID(id));
        const vms: ShearingLogVM[] = [];
        response.data.map(shearingLog => {
            //@ts-ignore
            vms.push(new ShearingLogVM(shearingLog.id, shearingLog.timestamp, shearingLog.wool_amount, shearingLog.sheep_id, shearingLog.shepherd_name, shearingLog.shepherd_surname));
        });
        return vms;
    }
}
