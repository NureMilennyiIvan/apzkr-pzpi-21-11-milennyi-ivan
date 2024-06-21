import { useEffect, useState } from "react";
import styles from "../../../assets/css/GridComponent.module.css"
import { useTranslation } from "react-i18next";
import { FeedingLogService } from "../../../api/services/FeedingLogService";
import { FeedingLog } from "../../../models/FeedingLog";

// Компонент для відображення таблиці з записами годування
export const FeedingLogsGrid = () => {
    const feedingLogService = new FeedingLogService();
    const [selectedFeedingLog, setSelectedFeedingLog] = useState<FeedingLog | null>(null); // Стан для зберігання вибраного запису годування
    const [feedingLogs, setFeedingLogs] = useState<FeedingLog[]>([]); // Стан для зберігання списку записів годування
    const [trigger, setTrigger] = useState<boolean>(true); // Стан для тригеру оновлення даних

    const { t } = useTranslation(); // Використання i18n для багатомовності

    // Використання useEffect для завантаження списку записів годування при першому рендері та при зміні тригеру
    useEffect(() => {
        const fetchFeedingLogs = async () => {
            try {
                // Отримання даних записів годування від сервісу FeedingLogService
                const data = await feedingLogService.getAll();
                setFeedingLogs(data); // Оновлення стану списку записів годування
            } catch (error) {
                alert(error);
                setFeedingLogs([]); // Очищення стану списку записів годування у разі помилки
            }
        };
        fetchFeedingLogs();
    }, [trigger]); // Виконання ефекту при зміні тригеру

    // Функція для обробки вибору рядка таблиці
    const handleRowSelection = (feedingLog: FeedingLog) => {
        setSelectedFeedingLog(feedingLog);
    };

    // Функція для видалення вибраного запису годування
    const deleteFeedingLog = async (id: number) => {
        try {
            await feedingLogService.delete(id);
            setSelectedFeedingLog(null); // Очистити вибір після видалення
            setTrigger(!trigger); // Оновити дані
        } catch (error) {
            console.log(error);
            alert("Error");
        }
    }
  
    return (
        <div className={styles.container}>
            <table className={styles.table}>
                <thead>
                    <tr className={styles.tr}>
                        <th className={styles.th}>{t("gridBase.chooseHeader")}</th>
                        <th className={styles.th}>{t("gridBase.idHeader")}</th>
                        <th className={styles.th}>{t("feedingLogsGrid.amountHeader")}</th>
                        <th className={styles.th}>{t("feedingLogsGrid.feedIdHeader")}</th>
                        <th className={styles.th}>{t("feedingLogsGrid.sheepIdHeader")}</th>
                        <th className={styles.th}>{t("feedingLogsGrid.shepherdIdHeader")}</th>
                        <th className={styles.th}>{t("feedingLogsGrid.timestampHeader")}</th>
                    </tr>
                </thead>
                <tbody>
                    {feedingLogs.length != 0 ? (
                        feedingLogs.map((feedingLog) => (
                            <tr key={feedingLog.id} 
                                className={`${styles.tr} ${selectedFeedingLog?.id === feedingLog.id ? styles.selected : ''}`}>
                                <td className={styles.td}>
                                    <input
                                        type="radio"
                                        name="selectedUser"
                                        checked={selectedFeedingLog?.id === feedingLog.id}
                                        onChange={() => handleRowSelection(feedingLog)}
                                    />
                                </td>
                                <td className={styles.td}>{feedingLog.id}</td>
                                <td className={styles.td}>{feedingLog.amount}</td>
                                <td className={styles.td}>{feedingLog.feed_id}</td>
                                <td className={styles.td}>{feedingLog.sheep_id}</td>
                                <td className={styles.td}>{feedingLog.shepherd_id ? feedingLog.shepherd_id : "null"}</td>
                                <td className={styles.td}>{feedingLog.timestamp}</td>
                            </tr>
                        ))
                    ) : (
                        <div className={styles.error}>{t("feedingLogsGrid.notFoundHeader")}</div>
                    )}
                </tbody>
            </table>
            <div className={styles.actionButtonsContainer}>
                <button 
                    className={`${styles.actionButton} ${selectedFeedingLog?.id ? '' : styles.disabledButton}`}
                    onClick={() => selectedFeedingLog ? deleteFeedingLog(selectedFeedingLog.id!) : undefined}
                    style={{ cursor: selectedFeedingLog ? 'pointer' : 'default' }}>
                    {t("gridBase.deleteButtonText")}
                </button>
            </div>
        </div>
    );
}