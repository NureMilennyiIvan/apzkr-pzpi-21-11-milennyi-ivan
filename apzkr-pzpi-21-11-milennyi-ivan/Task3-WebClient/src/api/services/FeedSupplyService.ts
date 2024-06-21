import axios from "axios";
import { FeedSupply } from "../../models/FeedSupply";
import { API_URL } from "../../utils/config";
import { FeedSupplyVM } from "../../viewModels/FeedSupplyVM";
import { IFeedSupplyService } from "../interfaces/IFeedSupplyService";

export class FeedSupplyService implements IFeedSupplyService {
    // Статичні URL-адреси для запитів до API
    private static FEED_SUPPLY_URLS = {
        GET_ALL: `${API_URL}/feed-supply`, // URL для отримання всіх поставок корму
        GET_BY_ID: (id: number) => `${API_URL}/feed-supply/${id}`, // URL для отримання поставки корму за ідентифікатором
        CREATE: `${API_URL}/feed-supply/create`, // URL для створення нової поставки корму
        DELETE: (id: number) => `${API_URL}/feed-supply/delete/${id}`, // URL для видалення поставки корму за ідентифікатором
        GET_ALL_VMS: `${API_URL}/feed-supply-vms`, // URL для отримання всіх моделей представлення поставок корму
        GET_ALL_VMS_BY_FEED_ID: (id: number) => `${API_URL}/feed-supply/feed/${id}` // URL для отримання всіх моделей представлення поставок корму за ідентифікатором корму
    }

    // Метод для створення нової поставки корму
    async create(item: FeedSupply): Promise<FeedSupply> {
        const response = await axios.post<FeedSupply>(FeedSupplyService.FEED_SUPPLY_URLS.CREATE, item);
        return response.data;
    }

    // Метод для видалення поставки корму за ідентифікатором
    async delete(itemId: number): Promise<void> {
        await axios.delete(FeedSupplyService.FEED_SUPPLY_URLS.DELETE(itemId));
    }

    // Метод для оновлення існуючої поставки корму (заборонений)
    async update(_item: FeedSupply): Promise<FeedSupply> {
        throw new Error("Method is forbidden.");
    }

    // Метод для отримання всіх поставок корму
    async getAll(): Promise<FeedSupply[]> {
        const response = await axios.get<FeedSupply[]>(FeedSupplyService.FEED_SUPPLY_URLS.GET_ALL);
        return response.data;
    }

    // Метод для отримання поставки корму за ідентифікатором
    async getById(id: number): Promise<FeedSupply | null> {
        const response = await axios.get<FeedSupply | null>(FeedSupplyService.FEED_SUPPLY_URLS.GET_BY_ID(id));
        return response.data;
    }

    // Метод для отримання всіх моделей представлення поставок корму
    async getAllVMs(): Promise<FeedSupplyVM[]> {
        const response = await axios.get<[]>(FeedSupplyService.FEED_SUPPLY_URLS.GET_ALL_VMS);
        const vms: FeedSupplyVM[] = [];
        response.data.map(feedSupply => {
            //@ts-ignore
            vms.push(new FeedSupplyVM(feedSupply.id, feedSupply.amount, feedSupply.timestamp, feedSupply.storekeeper_name, feedSupply.storekeeper_surname));
        });
        return vms;
    }

    // Метод для отримання всіх моделей представлення поставок корму за ідентифікатором корму
    async getAllVMsByFeedId(id: number): Promise<FeedSupplyVM[]> {
        const response = await axios.get<[]>(FeedSupplyService.FEED_SUPPLY_URLS.GET_ALL_VMS_BY_FEED_ID(id));
        const vms: FeedSupplyVM[] = [];
        response.data.map(feedSupply => {
            //@ts-ignore
            vms.push(new FeedSupplyVM(feedSupply.id, feedSupply.amount, feedSupply.timestamp, feedSupply.storekeeper_name, feedSupply.storekeeper_surname));
        });
        return vms;
    }
}
