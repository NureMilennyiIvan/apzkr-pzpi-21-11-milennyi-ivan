import { useEffect, useState } from "react";
import { FeedService } from "../../api/services/FeedService";
import { FeedVM } from "../../viewModels/FeedVM";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import styles from "../../assets/css/StorekeeperMainPage.module.css";
import { IUserProps } from "../properties/IUserProps";

// Компонент головної сторінки комірника
export const StorekeeperMainPage: React.FC<IUserProps> = () => {
    const feedService = new FeedService();
    const [feedsVMList, setFeedsVMList] = useState<FeedVM[]>([]); // Стан для зберігання списку кормів
    const navigate = useNavigate();
    const { t } = useTranslation(); // Використання i18n для багатомовності

    // Використання useEffect для завантаження списку кормів при першому рендері
    useEffect(() => {
        const fetchFeeds = async () => {
            try {
                // Отримання даних кормів від сервісу FeedService
                const data = await feedService.getAllVMs();
                setFeedsVMList(data); // Оновлення стану списку кормів
            } catch (error) {
                // Обробка помилки, якщо дані не вдалося отримати
                alert(error);
                setFeedsVMList([]); // Очищення стану списку кормів у разі помилки
            }
        }
        fetchFeeds();
    }, []);
    return (
        <div className={styles.container}>
        <div className={styles.list}>
            {feedsVMList.length > 0 ? (feedsVMList.map((feed) => (
            <div key={feed.id} className={styles.card}>
                <div onClick={() => navigate("feed/" + feed.id)}>
                    <div className={styles.cardHeader}>
                        <h2 className={styles.feedName}>{feed.name}</h2>
                    </div>
                    <div className={styles.cardBody}>
                        <p><strong>{t("storekeeperMainPage.feedBreedHeader")}:</strong> {feed.breedName}</p>
                        <p><strong>{t("storekeeperMainPage.feedAmountHeader")}:</strong> {feed.amount} {t("storekeeperMainPage.feedAmountUnitsHeader")}</p>
                        <p><strong>{t("storekeeperMainPage.feedSheepCountHeader")}:</strong> {feed.sheepCount}</p>
                    </div>
                    <button className={styles.button} onClick={(e) => { e.stopPropagation(); navigate("create/feed-supply/" + feed.id)}}>{t("storekeeperMainPage.feedAddSupplyButtonText")}</button>
                </div>
            </div>
          )))  : (
            <p>{t("storekeeperMainPage.notFoundHeader")}</p>
        )}
        </div>
        </div> 

    );
}