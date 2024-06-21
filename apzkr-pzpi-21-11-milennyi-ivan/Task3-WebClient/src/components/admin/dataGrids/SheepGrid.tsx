import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import styles from "../../../assets/css/GridComponent.module.css";
import { SheepService } from "../../../api/services/SheepService";
import { Sheep } from "../../../models/Sheep";

// Компонент для відображення таблиці з вівцями
export const SheepGrid = () => {
    const sheepService = new SheepService();
    const [selectedSheep, setSelectedSheep] = useState<Sheep | null>(null); // Стан для зберігання вибраної вівці
    const [sheep, setSheep] = useState<Sheep[]>([]); // Стан для зберігання списку овець
    const [trigger, setTrigger] = useState<boolean>(true); // Стан для тригеру оновлення даних

    const { t } = useTranslation(); // Використання i18n для багатомовності
    const navigate = useNavigate();

    // Використання useEffect для завантаження списку овець при першому рендері та при зміні тригеру
    useEffect(() => {
        const fetchSheep = async () => {
            try {
                // Отримання даних овець від сервісу SheepService
                const data = await sheepService.getAll();
                setSheep(data); // Оновлення стану списку овець
            } catch (error) {
                alert(error);
                setSheep([]); // Очищення стану списку овець у разі помилки
            }
        };
        fetchSheep();
    }, [trigger]); // Виконання ефекту при зміні тригеру

    // Функція для обробки вибору рядка таблиці
    const handleRowSelection = (sheep: Sheep) => {
        setSelectedSheep(sheep);
    };

    // Функція для переходу на сторінку створення нової вівці
    const createSheep = () => {
        navigate("/sheep/create");
    };

    // Функція для переходу на сторінку перепризначення пастуха для вибраної вівці
    const reassignShepherd = (sheepId: number) => {
        navigate(`/sheep/reassign-shepherd/${sheepId}`);
    };

    // Функція для переходу на сторінку перепризначення сканера температури для вибраної вівці
    const reassignTemperatureScanner = (sheepId: number) => {
        navigate(`/sheep/reassign-temperature-scanner/${sheepId}`);
    };

    // Функція для переходу на сторінку редагування вибраної вівці
    const editSheep = (id: number) => {
        navigate("/sheep/edit/" + id);
    };

    // Функція для видалення вибраної вівці
    const deleteSheep = async (id: number) => {
        try {
            await sheepService.delete(id);
            setSelectedSheep(null); // Очистити вибір після видалення
            setTrigger(!trigger); // Оновити дані
        } catch (error) {
            console.log(error);
            alert("Error");
        }
    };
  
    return (
        <div className={styles.container}>
            <table className={styles.table}>
                <thead>
                    <tr className={styles.tr}>
                        <th className={styles.th}>{t("gridBase.chooseHeader")}</th>
                        <th className={styles.th}>{t("gridBase.idHeader")}</th>
                        <th className={styles.th}>{t("sheepGrid.breedIdHeader")}</th>
                        <th className={styles.th}>{t("sheepGrid.shepherdIdHeader")}</th>
                        <th className={styles.th}>{t("sheepGrid.sexHeader")}</th>
                        <th className={styles.th}>{t("sheepGrid.birthDateHeader")}</th>
                        <th className={styles.th}>{t("sheepGrid.weightHeader")}</th>
                        <th className={styles.th}>{t("sheepGrid.temperatureScannerIdHeader")}</th>
                    </tr>
                </thead>
                <tbody>
                    {sheep.length != 0 ? (
                        sheep.map((sheep) => (
                            <tr key={sheep.id} 
                                className={`${styles.tr} ${selectedSheep?.id === sheep.id ? styles.selected : ''}`}>
                                <td className={styles.td}>
                                    <input
                                        type="radio"
                                        name="selectedUser"
                                        checked={selectedSheep?.id === sheep.id}
                                        onChange={() => handleRowSelection(sheep)}
                                    />
                                </td>
                                <td className={styles.td}>{sheep.id}</td>
                                <td className={styles.td}>{sheep.breed_id}</td>
                                <td className={styles.td}>{sheep.shepherd_id ? sheep.shepherd_id : "null"}</td>
                                <td className={styles.td}>{sheep.sex.toString()}</td>
                                <td className={styles.td}>{sheep.birth_date}</td>
                                <td className={styles.td}>{sheep.weight}</td>
                                <td className={styles.td}>{sheep.temperature_scanner_id ? sheep.temperature_scanner_id : "null"}</td>
                            </tr>
                        ))
                    ) : (
                        <div className={styles.error}>{t("sheepGrid.notFoundHeader")}</div>
                    )}
                </tbody>
            </table>
            <div className={styles.actionButtonsContainer}>
                <button className={styles.actionButton} onClick={() => createSheep()}>
                    {t("gridBase.addButtonText")}
                </button>
                <button 
                    className={`${styles.actionButton} ${selectedSheep?.id ? '' : styles.disabledButton}`}
                    onClick={() => selectedSheep ? editSheep(selectedSheep.id!) : undefined}
                    style={{ cursor: selectedSheep ? 'pointer' : 'default' }}>
                    {t("gridBase.editButtonText")}
                </button>
                <button 
                    className={`${styles.actionButton} ${selectedSheep?.id ? '' : styles.disabledButton}`}
                    onClick={() => selectedSheep ? reassignShepherd(selectedSheep.id!) : undefined}
                    style={{ cursor: selectedSheep ? 'pointer' : 'default' }}>
                    {t("sheepGrid.reassignShepherdButtonText")}
                </button>
                <button 
                    className={`${styles.actionButton} ${selectedSheep?.id ? '' : styles.disabledButton}`}
                    onClick={() => selectedSheep ? reassignTemperatureScanner(selectedSheep.id!) : undefined}
                    style={{ cursor: selectedSheep ? 'pointer' : 'default' }}>
                    {t("sheepGrid.reassignTemperatureScannerButtonText")}
                </button>
                <button 
                    className={`${styles.actionButton} ${selectedSheep?.id ? '' : styles.disabledButton}`}
                    onClick={() => selectedSheep ? deleteSheep(selectedSheep.id!) : undefined}
                    style={{ cursor: selectedSheep ? 'pointer' : 'default' }}>
                    {t("gridBase.deleteButtonText")}
                </button>
            </div>
        </div>
    );
}