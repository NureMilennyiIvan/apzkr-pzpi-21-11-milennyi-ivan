import { useEffect, useState } from "react";
import { FeedingLogService } from "../../api/services/FeedingLogService";
import { FeedingLogVM } from "../../viewModels/FeedingLogVM";
import styles from "../../assets/css/FeedingLogsList.module.css";
import { useTranslation } from "react-i18next";

// Інтерфейс для пропсів компоненту FeedingLogsListFeed
interface IFeedingLogsListFeed {
    feedId: number; // Ідентифікатор корму
}

// Компонент для відображення списку записів годування для окремого корму
export const FeedingLogsListFeed: React.FC<IFeedingLogsListFeed> = ({ feedId }) => {
    const feedingLogService = new FeedingLogService();
    const [feedingLogsVMList, setFeedingLogsVMList] = useState<FeedingLogVM[]>([]); // Стан для зберігання списку записів годування
    const { t } = useTranslation(); // Використання i18n для багатомовності

    // Використання useEffect для завантаження списку записів годування при першому рендері
    useEffect(() => {
        const fetchFeedSupplies = async () => {
            try {
                // Отримання даних записів годування від сервісу FeedingLogService
                const data = await feedingLogService.getAllVMsByFeedId(feedId);
                setFeedingLogsVMList(data); // Оновлення стану списку записів годування
            } catch (error) {
                // Обробка помилки, якщо дані не вдалося отримати
                alert(error);
                setFeedingLogsVMList([]); // Очищення стану списку записів годування у разі помилки
            }
        }
        fetchFeedSupplies();
    }, []); // Виконання ефекту лише при першому рендері
    
    return (
        <div className={styles.list}>
            {feedingLogsVMList.length > 0 ? (feedingLogsVMList.map((feedingLog) => (
                <div key={feedingLog.id} className={styles.card}>
                    <div className={styles.cardHeader}>
                        <h2 className={styles.logId}>{t("feedingLogsList.logHeader")} #{feedingLog.id}</h2>
                    </div>
                    <div className={styles.cardBody}>
                            <p><strong>{t("feedingLogsList.sheepHeader")}:</strong> #{feedingLog.sheepId}</p>
                            <p><strong>{t("feedingLogsList.performerHeader")}:</strong> {feedingLog.shepherdName !== null ? `${feedingLog.shepherdName} ${feedingLog.shepherdSurname}` : `${t("feedingLogsList.noDataHeader")}`}</p>
                            <p><strong>{t("feedingLogsList.feedAmountHeader")}:</strong> {feedingLog.amount} {t("feedingLogsList.feedAmountUnitsHeader")}</p>
                            <p><strong>{t("feedingLogsList.dateHeader")}:</strong> {feedingLog.date}</p>
                    </div>
                </div>
            ))) : (
                <p>{t("feedingLogsList.notFoundHeader")}</p>
            )}
        </div>
    )
}