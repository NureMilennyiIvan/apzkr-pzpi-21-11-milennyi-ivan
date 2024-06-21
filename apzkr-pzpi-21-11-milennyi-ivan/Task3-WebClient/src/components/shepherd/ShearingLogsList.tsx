import { useEffect, useState } from "react";
import { ShearingLogService } from "../../api/services/ShearingLogService";
import { ShearingLogVM } from "../../viewModels/ShearingLogVM";
import styles from "../../assets/css/ShearingLogsList.module.css";
import { useTranslation } from "react-i18next";
// Інтерфейс для пропсів компоненту ShearingLogsList
interface IShearingLogsList {
    sheepId: number; // Ідентифікатор вівці
}

// Компонент для відображення списку записів стрижки для окремої вівці
export const ShearingLogsList: React.FC<IShearingLogsList> = ({ sheepId }) => {
    const shearingLogService = new ShearingLogService();
    const [shearingLogsVMList, setShearingLogsVMList] = useState<ShearingLogVM[]>([]); // Стан для зберігання списку записів стрижки
    const { t } = useTranslation(); // Використання i18n для багатомовності

    // Використання useEffect для завантаження списку записів стрижки при першому рендері
    useEffect(() => {
        const fetchFeedSupplies = async () => {
            try {
                // Отримання даних записів стрижки від сервісу ShearingLogService
                const data = await shearingLogService.getAllVMsBySheepId(sheepId);
                setShearingLogsVMList(data); // Оновлення стану списку записів стрижки
            } catch (error) {
                // Обробка помилки, якщо дані не вдалося отримати
                alert(error);
                setShearingLogsVMList([]); // Очищення стану списку записів стрижки у разі помилки
            }
        }
        fetchFeedSupplies();
    }, []);
    return (
        <div className={styles.list}>
            {shearingLogsVMList.length > 0 ? (shearingLogsVMList.map((shearingLog) => (
                <div key={shearingLog.id} className={styles.card}>
                    <div className={styles.cardHeader}>
                        <h2 className={styles.logId}>{t("shearingLogsList.logHeader")} #{shearingLog.id}</h2>
                    </div>
                    <div className={styles.cardBody}>
                            <p><strong>{t("shearingLogsList.sheepHeader")}:</strong> #{shearingLog.sheepId}</p>
                            <p><strong>{t("shearingLogsList.performerHeader")}:</strong> {shearingLog.shepherdName !== null ? `${shearingLog.shepherdName} ${shearingLog.shepherdSurname}` : `${t("shearingLogsList.noDataHeader")}`}</p>
                            <p><strong>{t("shearingLogsList.feedAmountHeader")}:</strong> {shearingLog.woolAmount} {t("shearingLogsList.feedAmountUnitsHeader")}</p>
                            <p><strong>{t("shearingLogsList.dateHeader")}:</strong> {shearingLog.date}</p>
                    </div>
                </div>
            ))) : (
                <p>{t("shearingLogsList.notFoundHeader")}</p>
            )}
        </div>
    )
}