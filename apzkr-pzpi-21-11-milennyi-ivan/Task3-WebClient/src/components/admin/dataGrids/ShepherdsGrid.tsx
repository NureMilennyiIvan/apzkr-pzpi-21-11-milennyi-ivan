import { useEffect, useState } from "react";
import { ShepherdService } from "../../../api/services/ShepherdService";
import { Shepherd } from "../../../models/Shepherd";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import styles from "../../../assets/css/GridComponent.module.css"

// Компонент для відображення таблиці з пастухами
export const ShepehrdsGrid = () => {
    const shepherdService = new ShepherdService();
    const [selectedShepherd, setSelectedShepherd] = useState<Shepherd | null>(null); // Стан для зберігання вибраного пастуха
    const [shepherds, setShepherds] = useState<Shepherd[]>([]); // Стан для зберігання списку пастухів
    const [trigger, setTrigger] = useState<boolean>(true); // Стан для тригеру оновлення даних

    const { t } = useTranslation(); // Використання i18n для багатомовності
    const navigate = useNavigate();

    // Використання useEffect для завантаження списку пастухів при першому рендері та при зміні тригеру
    useEffect(() => {
        const fetchShepherds = async () => {
            try {
                // Отримання даних пастухів від сервісу ShepherdService
                const data = await shepherdService.getAll();
                setShepherds(data); // Оновлення стану списку пастухів
            } catch (error) {
                alert(error);
                setShepherds([]); // Очищення стану списку пастухів у разі помилки
            }
        };
        fetchShepherds();
    }, [trigger]); // Виконання ефекту при зміні тригеру

    // Функція для обробки вибору рядка таблиці
    const handleRowSelection = (shepherd: Shepherd) => {
        setSelectedShepherd(shepherd);
    };

    // Функція для переходу на сторінку створення нового пастуха
    const createShepherd = () => {
        navigate("/shepherd/create");
    }

    // Функція для переходу на сторінку редагування вибраного пастуха
    const editShepherd = (id: number) => {
        navigate("/shepherd/edit/" + id);
    }

    // Функція для видалення вибраного пастуха
    const deleteShepherd = async (id: number) => {
        try {
            await shepherdService.delete(id);
            setSelectedShepherd(null); // Очистити вибір після видалення
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
                        <th className={styles.th}>{t("shepherdsGrid.usernameHeader")}</th>
                        <th className={styles.th}>{t("shepherdsGrid.passwordHeader")}</th>
                        <th className={styles.th}>{t("shepherdsGrid.nameHeader")}</th>
                        <th className={styles.th}>{t("shepherdsGrid.surnameHeader")}</th>
                    </tr>
                </thead>
                <tbody>
                    {shepherds.length != 0 ? (
                        shepherds.map((shepherd) => (
                            <tr key={shepherd.id} 
                                className={`${styles.tr} ${selectedShepherd?.id === shepherd.id ? styles.selected : ''}`}>
                                <td className={styles.td}>
                                    <input
                                        type="radio"
                                        name="selectedUser"
                                        checked={selectedShepherd?.id === shepherd.id}
                                        onChange={() => handleRowSelection(shepherd)}
                                    />
                                </td>
                                <td className={styles.td}>{shepherd.id}</td>
                                <td className={styles.td}>{shepherd.username}</td>
                                <td className={styles.td}>{shepherd.password}</td>
                                <td className={styles.td}>{shepherd.name}</td>
                                <td className={styles.td}>{shepherd.surname}</td>
                            </tr>
                        ))
                    ) : (
                        <div className={styles.error}>{t("shepherdsGrid.notFoundHeader")}</div>
                    )}
                </tbody>
            </table>
            <div className={styles.actionButtonsContainer}>
                <button className={styles.actionButton} onClick={() => createShepherd()}>
                    {t("gridBase.addButtonText")}
                </button>
                <button 
                    className={`${styles.actionButton} ${selectedShepherd?.id ? '' : styles.disabledButton}`}
                    onClick={() => selectedShepherd ? editShepherd(selectedShepherd.id!) : undefined}
                    style={{ cursor: selectedShepherd ? 'pointer' : 'default' }}>
                    {t("gridBase.editButtonText")}
                </button>
                <button 
                    className={`${styles.actionButton} ${selectedShepherd?.id ? '' : styles.disabledButton}`}
                    onClick={() => selectedShepherd ? deleteShepherd(selectedShepherd.id!) : undefined}
                    style={{ cursor: selectedShepherd ? 'pointer' : 'default' }}>
                    {t("gridBase.deleteButtonText")}
                </button>
            </div>
        </div>
    );
}