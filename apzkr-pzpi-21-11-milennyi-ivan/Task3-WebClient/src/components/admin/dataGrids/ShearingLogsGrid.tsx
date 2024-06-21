import { useEffect, useState } from "react";
import styles from "../../../assets/css/GridComponent.module.css"
import { useTranslation } from "react-i18next";
import { ShearingLogService } from "../../../api/services/ShearingLogService";
import { ShearingLog } from "../../../models/ShearingLog";

// Компонент для відображення таблиці з записами стрижки вовни
export const ShearingLogsGrid = () => {
    const shearingLogService = new ShearingLogService();
    const [selectedShearingLog, setSelectedShearingLog] = useState<ShearingLog | null>(null); // Стан для зберігання вибраного запису стрижки вовни
    const [shearingLogs, setShearingLogs] = useState<ShearingLog[]>([]); // Стан для зберігання списку записів стрижки вовни
    const [trigger, setTrigger] = useState<boolean>(true); // Стан для тригеру оновлення даних

    const { t } = useTranslation(); // Використання i18n для багатомовності

    // Використання useEffect для завантаження списку записів стрижки вовни при першому рендері та при зміні тригеру
    useEffect(() => {
        const fetchShearingLogs = async () => {
            try {
                // Отримання даних записів стрижки вовни від сервісу ShearingLogService
                const data = await shearingLogService.getAll();
                setShearingLogs(data); // Оновлення стану списку записів стрижки вовни
            } catch (error) {
                alert(error);
                setShearingLogs([]); // Очищення стану списку записів стрижки вовни у разі помилки
            }
        };
        fetchShearingLogs();
    }, [trigger]); // Виконання ефекту при зміні тригеру

    // Функція для обробки вибору рядка таблиці
    const handleRowSelection = (shearingLog: ShearingLog) => {
        setSelectedShearingLog(shearingLog);
    };

    // Функція для видалення вибраного запису стрижки вовни
    const deleteShearingLog = async (id: number) => {
        try {
            await shearingLogService.delete(id);
            setSelectedShearingLog(null); // Очистити вибір після видалення
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
                        <th className={styles.th}>{t("shearingLogsGrid.woolAmountHeader")}</th>
                        <th className={styles.th}>{t("shearingLogsGrid.sheepIdHeader")}</th>
                        <th className={styles.th}>{t("shearingLogsGrid.shepherdIdHeader")}</th>
                        <th className={styles.th}>{t("shearingLogsGrid.timestampHeader")}</th>
                    </tr>
                </thead>
                <tbody>
                    {shearingLogs.length != 0 ? (
                        shearingLogs.map((shearingLog) => (
                            <tr key={shearingLog.id} 
                                className={`${styles.tr} ${selectedShearingLog?.id === shearingLog.id ? styles.selected : ''}`}>
                                <td className={styles.td}>
                                    <input
                                        type="radio"
                                        name="selectedUser"
                                        checked={selectedShearingLog?.id === shearingLog.id}
                                        onChange={() => handleRowSelection(shearingLog)}
                                    />
                                </td>
                                <td className={styles.td}>{shearingLog.id}</td>
                                <td className={styles.td}>{shearingLog.wool_amount}</td>
                                <td className={styles.td}>{shearingLog.sheep_id}</td>
                                <td className={styles.td}>{shearingLog.shepherd_id ? shearingLog.shepherd_id : "null"}</td>
                                <td className={styles.td}>{shearingLog.timestamp}</td>
                            </tr>
                        ))
                    ) : (
                        <div className={styles.error}>{t("shearingLogsGrid.notFoundHeader")}</div>
                    )}
                </tbody>
            </table>
            <div className={styles.actionButtonsContainer}>
                <button 
                    className={`${styles.actionButton} ${selectedShearingLog?.id ? '' : styles.disabledButton}`}
                    onClick={() => selectedShearingLog ? deleteShearingLog(selectedShearingLog.id!) : undefined}
                    style={{ cursor: selectedShearingLog ? 'pointer' : 'default' }}>
                    {t("gridBase.deleteButtonText")}
                </button>
            </div>
        </div>
    );
}