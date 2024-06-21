import { useEffect, useState } from "react";
import { FeedService } from "../../api/services/FeedService";
import { FeedVM } from "../../viewModels/FeedVM";
import styles from '../../assets/css/FeedsList.module.css';
import { useTranslation } from "react-i18next";


// Компонент для відображення списку кормів
export const FeedsList: React.FC = () => {
    const feedService = new FeedService();
    const [feedsVMList, setFeedsVMList] = useState<FeedVM[]>([]); // Стан для зберігання списку кормів
    const { t } = useTranslation(); // Використання i18n для багатомовності

    // Використання useEffect для завантаження списку кормів при першому рендері
    useEffect(() => {
        const fetchFeeds = async () => {
            try {
                const data = await feedService.getAllVMs();
                setFeedsVMList(data);
            } catch (error) {
                alert(error);
                setFeedsVMList([]);
            }
        }
        fetchFeeds();
    }, []);
    
    return (
        <div className={styles.list}>
            {feedsVMList.length > 0 ? (
                feedsVMList.map((feed) => (
                    <div key={feed.id} className={styles.card}>
                        <div className={styles.cardHeader}>
                            <h2 className={styles.feedName}>{feed.name}</h2>
                        </div>
                        <div className={styles.cardBody}>
                            <p><strong>{t("feedsList.amountHeader")}:</strong> {feed.amount} {t("feedsList.amountUnitsHeader")}</p>
                            <p><strong>{t("feedsList.caloriesHeader")}:</strong> {feed.calories} {t("feedsList.caloriesUnitsHeader")}</p>
                            <p><strong>{t("feedsList.fatsHeader")}:</strong> {feed.fat} г</p>
                            <p><strong>{t("feedsList.proteinsHeader")}:</strong> {feed.protein} г</p>
                            <p><strong>{t("feedsList.carbohydratesHeader")}:</strong> {feed.carbohydrates} г</p>
                            <p><strong>{t("feedsList.breedHeader")}:</strong> {feed.breedName ? feed.breedName : `${t('feedsList.notAssignedHeader')}` }</p>
                            <p><strong>{t("feedsList.sheepCountHeader")}:</strong> {feed.sheepCount}</p>
                        </div>
                    </div>
                ))
            ) : (
                <p>{t("feedsList.notFoundHeader")}</p>
            )}
        </div>
    );
}
