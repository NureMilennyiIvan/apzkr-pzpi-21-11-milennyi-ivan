import { useEffect, useState } from "react";
import { FeedingLogService } from "../../api/services/FeedingLogService";
import { FeedingLogVM } from "../../viewModels/FeedingLogVM";
import styles from "../../assets/css/FeedingLogsList.module.css";
import { useTranslation } from "react-i18next";
// Інтерфейс для пропсів компоненту FeedingLogsListSheep
interface IFeedingLogsListSheep {
    sheepId: number;
}

// Компонент для відображення списку записів годування для окремої вівці
export const FeedingLogsListSheep: React.FC<IFeedingLogsListSheep> = ({ sheepId }) => {
    const feedingLogService = new FeedingLogService();
    const [feedingLogsVMList, setFeedingLogsVMList] = useState<FeedingLogVM[]>([]); // Стан для зберігання списку записів годування
    const { t } = useTranslation(); // Використання i18n для багатомовності

    // Використання useEffect для завантаження списку записів годування при першому рендері
    useEffect(() => {
        const fetchFeedSupplies = async () => {
            try {
                const data = await feedingLogService.getAllVMsBySheepId(sheepId);
                setFeedingLogsVMList(data);
            } catch (error) {
                alert(error);
                setFeedingLogsVMList([]);
            }
        }
        fetchFeedSupplies();
    }, []);
    
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