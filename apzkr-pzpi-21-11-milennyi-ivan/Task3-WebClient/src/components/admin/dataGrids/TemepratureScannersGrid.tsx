import { useEffect, useState } from "react";
import { TemperatureScannerService } from "../../../api/services/TemperatureScannerService";
import { TemperatureScanner } from "../../../models/TemperatureScanner";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import styles from "../../../assets/css/GridComponent.module.css"

// Компонент для відображення таблиці з температурними сканерами
export const TemperatureScannersGrid = () =>{
    const temperatureScannerService = new TemperatureScannerService();
    const [selectedTemperatureScanner, setSelectedTemperatureScanner] = useState<TemperatureScanner | null>(null); // Стан для зберігання вибраного сканера
    const [temperatureScanners, setTemperatureScanners] = useState<TemperatureScanner[]>([]); // Стан для зберігання списку сканерів
    const [trigger, setTrigger] = useState<boolean>(true); // Стан для тригеру оновлення даних

    const {t} = useTranslation(); // Використання i18n для багатомовності
    const navigate = useNavigate(); // Використання useNavigate для навігації
    
    // Використання useEffect для завантаження списку сканерів при першому рендері та при зміні тригеру
    useEffect(() => {
        const fetchTemperatureScanners = async () => {
            try {
                // Отримання даних сканерів від сервісу TemperatureScannerService
                const data = await temperatureScannerService.getAll();
                setTemperatureScanners(data); // Оновлення стану списку сканерів
            } catch (error) {
                alert(error);
                setTemperatureScanners([]); // Очищення стану списку сканерів у разі помилки
            }
        };
        fetchTemperatureScanners();
    }, [trigger]); // Виконання ефекту при зміні тригеру

    // Функція для обробки вибору рядка таблиці
    const handleRowSelection = (temperatureScanner: TemperatureScanner) => {
        setSelectedTemperatureScanner(temperatureScanner);
    };

    // Функція для переходу на сторінку створення нового сканера
    const createTemperatureScanner = () => {
        navigate("/temperature-scanner/create");
    }

    // Функція для переходу на сторінку редагування вибраного сканера
    const editTemperatureScanner = (id: number) => {
        navigate("/temperature-scanner/edit/" + id);
    }

    // Функція для видалення вибраного сканера
    const deleteTemperatureScanner = async (id: number) => {
        try{
            await temperatureScannerService.delete(id);
            setSelectedTemperatureScanner(null); // Очистити вибір після видалення
            setTrigger(!trigger); // Оновити дані
        }
        catch(error){
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
                        <th className={styles.th}>{t("temeperatureScannersGrid.passwordHeader")}</th>
                        <th className={styles.th}>{t("temeperatureScannersGrid.temperatureHeader")}</th>
                    </tr>
                </thead>
                <tbody>
                    {temperatureScanners.length != 0 ? (
                        temperatureScanners.map((temperatureScanner) => (
                            <tr key={temperatureScanner.id} 
                                className={`${styles.tr} ${selectedTemperatureScanner?.id === temperatureScanner.id ? styles.selected : ''}`}>
                                <td className={styles.td}>
                                    <input
                                        type="radio"
                                        name="selectedUser"
                                        checked={selectedTemperatureScanner?.id === temperatureScanner.id}
                                        onChange={() => handleRowSelection(temperatureScanner)}
                                    />
                                </td>
                                <td className={styles.td}>{temperatureScanner.id}</td>
                                <td className={styles.td}>{temperatureScanner.password}</td>
                                <td className={styles.td}>{temperatureScanner.temperature}</td>
                            </tr>
                        ))
                    ) : (
                        <div className={styles.error}>{t("temeperatureScannersGrid.notFoundHeader")}</div>
                    )}
                </tbody>
            </table>
            <div className={styles.actionButtonsContainer}>
                <button className={styles.actionButton} onClick={() => createTemperatureScanner()}>
                    {t("gridBase.addButtonText")}
                </button>
                <button 
                    className={`${styles.actionButton} ${selectedTemperatureScanner?.id ? '' : styles.disabledButton}`}
                    onClick={() => selectedTemperatureScanner ? editTemperatureScanner(selectedTemperatureScanner.id!) : undefined}
                    style={{ cursor: selectedTemperatureScanner ? 'pointer' : 'default' }}>
                    {t("gridBase.editButtonText")}
                </button>
                <button 
                    className={`${styles.actionButton} ${selectedTemperatureScanner?.id ? '' : styles.disabledButton}`}
                    onClick={() => selectedTemperatureScanner ? deleteTemperatureScanner(selectedTemperatureScanner.id!) : undefined}
                    style={{ cursor: selectedTemperatureScanner ? 'pointer' : 'default' }}>
                    {t("gridBase.deleteButtonText")}
                </button>
            </div>
        </div>
    );
}