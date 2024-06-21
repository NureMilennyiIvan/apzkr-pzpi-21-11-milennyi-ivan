import { useEffect, useState } from "react";
import styles from "../../../assets/css/GridComponent.module.css"
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { Feed } from "../../../models/Feed";
import { FeedService } from "../../../api/services/FeedService";

// Компонент для відображення таблиці з кормами
export const FeedsGrid = () => {
    const feedService = new FeedService();
    const [selectedFeed, setSelectedFeed] = useState<Feed | null>(null); // Стан для зберігання вибраного корму
    const [feeds, setFeeds] = useState<Feed[]>([]); // Стан для зберігання списку кормів
    const [trigger, setTrigger] = useState<boolean>(true); // Стан для тригеру оновлення даних

    const { t } = useTranslation(); // Використання i18n для багатомовності
    const navigate = useNavigate();

    // Використання useEffect для завантаження списку кормів при першому рендері та при зміні тригеру
    useEffect(() => {
        const fetchFeeds = async () => {
            try {
                // Отримання даних кормів від сервісу FeedService
                const data = await feedService.getAll();
                setFeeds(data); // Оновлення стану списку кормів
            } catch (error) {
                alert(error);
                setFeeds([]); // Очищення стану списку кормів у разі помилки
            }
        };
        fetchFeeds();
    }, [trigger]); // Виконання ефекту при зміні тригеру

    // Функція для обробки вибору рядка таблиці
    const handleRowSelection = (feed: Feed) => {
        setSelectedFeed(feed);
    };

    // Функція для переходу на сторінку створення нового корму
    const createFeed = () => {
        navigate("/feed/create");
    }

    // Функція для переходу на сторінку редагування вибраного корму
    const editFeed = (id: number) => {
        navigate("/feed/edit/" + id);
    }

    // Функція для видалення вибраного корму
    const deleteFeed = async (id: number) => {
        try {
            await feedService.delete(id);
            setSelectedFeed(null); // Очистити вибір після видалення
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
                        <th className={styles.th}>{t("feedsGrid.nameHeader")}</th>
                        <th className={styles.th}>{t("feedsGrid.amountHeader")}</th>
                        <th className={styles.th}>{t("feedsGrid.caloriesHeader")}</th>
                        <th className={styles.th}>{t("feedsGrid.proteinHeader")}</th>
                        <th className={styles.th}>{t("feedsGrid.carbohydratesHeader")}</th>
                        <th className={styles.th}>{t("feedsGrid.fatHeader")}</th>
                    </tr>
                </thead>
                <tbody>
                    {feeds.length != 0 ? (
                        feeds.map((feed) => (
                            <tr key={feed.id} 
                                className={`${styles.tr} ${selectedFeed?.id === feed.id ? styles.selected : ''}`}>
                                <td className={styles.td}>
                                    <input
                                        type="radio"
                                        name="selectedUser"
                                        checked={selectedFeed?.id === feed.id}
                                        onChange={() => handleRowSelection(feed)}
                                    />
                                </td>
                                <td className={styles.td}>{feed.id}</td>
                                <td className={styles.td}>{feed.name}</td>
                                <td className={styles.td}>{feed.amount}</td>
                                <td className={styles.td}>{feed.calories}</td>
                                <td className={styles.td}>{feed.protein}</td>
                                <td className={styles.td}>{feed.carbohydrates}</td>
                                <td className={styles.td}>{feed.fat}</td>
                            </tr>
                        ))
                    ) : (
                        <div className={styles.error}>{t("feedsGrid.notFoundHeader")}</div>
                    )}
                </tbody>
            </table>
            <div className={styles.actionButtonsContainer}>
                <button className={styles.actionButton} onClick={() => createFeed()}>
                    {t("gridBase.addButtonText")}
                </button>
                <button 
                    className={`${styles.actionButton} ${selectedFeed?.id ? '' : styles.disabledButton}`}
                    onClick={() => selectedFeed ? editFeed(selectedFeed.id!) : undefined}
                    style={{ cursor: selectedFeed ? 'pointer' : 'default' }}>
                    {t("gridBase.editButtonText")}
                </button>
                <button 
                    className={`${styles.actionButton} ${selectedFeed?.id ? '' : styles.disabledButton}`}
                    onClick={() => selectedFeed ? deleteFeed(selectedFeed.id!) : undefined}
                    style={{ cursor: selectedFeed ? 'pointer' : 'default' }}>
                    {t("gridBase.deleteButtonText")}
                </button>
            </div>
        </div>
    );
}