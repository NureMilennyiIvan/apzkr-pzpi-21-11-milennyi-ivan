import axios from "axios";
import { Feed } from "../../models/Feed";
import { API_URL } from "../../utils/config";
import { FeedVM } from "../../viewModels/FeedVM";
import { IFeedService } from "../interfaces/IFeedServiceService";

export class FeedService implements IFeedService {
    // Статичні URL-адреси для запитів до API
    private static FEED_URLS = {
        GET_ALL: `${API_URL}/feed`, // URL для отримання всіх кормів
        GET_BY_ID: (id: number) => `${API_URL}/feed/${id}`, // URL для отримання корму за ідентифікатором
        CREATE: `${API_URL}/feed/create`, // URL для створення нового корму
        DELETE: (id: number) => `${API_URL}/feed/delete/${id}`, // URL для видалення корму за ідентифікатором
        UPDATE: `${API_URL}/feed/update`, // URL для оновлення корму
        GET_ALL_VMS: `${API_URL}/feed-vms` // URL для отримання всіх моделей представлення кормів
    }

    // Метод для створення нового корму
    async create(item: Feed): Promise<Feed> {
        const response = await axios.post<Feed>(FeedService.FEED_URLS.CREATE, item);
        return response.data;
    }

    // Метод для видалення корму за ідентифікатором
    async delete(itemId: number): Promise<void> {
        await axios.delete(FeedService.FEED_URLS.DELETE(itemId));
    }

    // Метод для оновлення існуючого корму
    async update(item: Feed): Promise<Feed> {
        const response = await axios.put<Feed>(FeedService.FEED_URLS.UPDATE, item);
        return response.data;
    }

    // Метод для отримання всіх кормів
    async getAll(): Promise<Feed[]> {
        const response = await axios.get<Feed[]>(FeedService.FEED_URLS.GET_ALL);
        return response.data;
    }

    // Метод для отримання корму за ідентифікатором
    async getById(id: number): Promise<Feed | null> {
        const response = await axios.get<Feed | null>(FeedService.FEED_URLS.GET_BY_ID(id));
        return response.data;
    }

    // Метод для отримання всіх моделей представлення кормів
    async getAllVMs(): Promise<FeedVM[]> {
        const response = await axios.get<[]>(FeedService.FEED_URLS.GET_ALL_VMS);
        const vms: FeedVM[] = [];
        response.data.map(feed => {
            //@ts-ignore
            vms.push(new FeedVM(feed.id, feed.amount, feed.name, feed.calories, feed.fat, feed.protein, feed.carbohydrates, feed.breed_name, feed.sheep_count));
        });
        return vms;
    }
}