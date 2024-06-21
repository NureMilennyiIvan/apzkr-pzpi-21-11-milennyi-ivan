import axios from "axios";
import { FeedingLog } from "../../models/FeedingLog";
import { API_URL } from "../../utils/config";
import { FeedingLogVM } from "../../viewModels/FeedingLogVM";
import { IFeedingLogService } from "../interfaces/IFeedingLogService";

export class FeedingLogService implements IFeedingLogService {
    // Статичні URL-адреси для запитів до API
    private static FEEDING_LOG_URLS = {
        GET_ALL: `${API_URL}/feeding-log`, // URL для отримання всіх записів годування
        GET_BY_ID: (id: number) => `${API_URL}/feeding-log/${id}`, // URL для отримання запису годування за ідентифікатором
        CREATE: `${API_URL}/feeding-log/create`, // URL для створення нового запису годування
        DELETE: (id: number) => `${API_URL}/feeding-log/delete/${id}`, // URL для видалення запису годування за ідентифікатором
        GET_ALL_VMS_BY_SHEEP_ID: (id: number) => `${API_URL}/feeding-log/sheep/${id}`, // URL для отримання всіх моделей представлення записів годування за ідентифікатором вівці
        GET_ALL_VMS_BY_FEED_ID: (id: number) => `${API_URL}/feeding-log/feed/${id}` // URL для отримання всіх моделей представлення записів годування за ідентифікатором корму
    }

    // Метод для створення нового запису годування
    async create(item: FeedingLog): Promise<FeedingLog> {
        const response = await axios.post<FeedingLog>(FeedingLogService.FEEDING_LOG_URLS.CREATE, item);
        return response.data;
    }

    // Метод для видалення запису годування за ідентифікатором
    async delete(itemId: number): Promise<void> {
        await axios.delete(FeedingLogService.FEEDING_LOG_URLS.DELETE(itemId));
    }

    // Метод для оновлення існуючого запису годування (заборонений)
    async update(_item: FeedingLog): Promise<FeedingLog> {
        throw new Error("Method is forbidden.");
    }

    // Метод для отримання всіх записів годування
    async getAll(): Promise<FeedingLog[]> {
        const response = await axios.get<FeedingLog[]>(FeedingLogService.FEEDING_LOG_URLS.GET_ALL);
        return response.data;
    }

    // Метод для отримання запису годування за ідентифікатором
    async getById(id: number): Promise<FeedingLog | null> {
        const response = await axios.get<FeedingLog | null>(FeedingLogService.FEEDING_LOG_URLS.GET_BY_ID(id));
        return response.data;
    }

    // Метод для отримання всіх моделей представлення записів годування за ідентифікатором вівці
    async getAllVMsBySheepId(id: number): Promise<FeedingLogVM[]> {
        const response = await axios.get<[]>(FeedingLogService.FEEDING_LOG_URLS.GET_ALL_VMS_BY_SHEEP_ID(id));
        const vms: FeedingLogVM[] = [];
        response.data.map(feedingLog => {
            //@ts-ignore
            vms.push(new FeedingLogVM(feedingLog.id, feedingLog.timestamp, feedingLog.amount, feedingLog.sheep_id, feedingLog.shepherd_name, feedingLog.shepherd_surname));
        });
        return vms;
    }

    // Метод для отримання всіх моделей представлення записів годування за ідентифікатором корму
    async getAllVMsByFeedId(id: number): Promise<FeedingLogVM[]> {
        const response = await axios.get<[]>(FeedingLogService.FEEDING_LOG_URLS.GET_ALL_VMS_BY_FEED_ID(id));
        const vms: FeedingLogVM[] = [];
        response.data.map(feedingLog => {
            //@ts-ignore
            vms.push(new FeedingLogVM(feedingLog.id, feedingLog.timestamp, feedingLog.amount, feedingLog.sheep_id, feedingLog.shepherd_name, feedingLog.shepherd_surname));
        });
        return vms;
    }
}