import { useEffect, useState } from "react";
import { BreedService } from "../../api/services/BreedService";
import { BreedVM } from "../../viewModels/BreedVM";
import styles from '../../assets/css/BreedList.module.css';
import { useTranslation } from "react-i18next";

// Компонент для відображення списку порід
export const BreedsList: React.FC = () => {
    const breedService = new BreedService();
    const [breedsVMList, setBreedsVMList] = useState<BreedVM[]>([]); // Стан для зберігання списку порід
    const { t } = useTranslation(); // Використання i18n для багатомовності

    // Використання useEffect для завантаження списку порід при першому рендері
    useEffect(() => {
        const fetchBreeds = async () => {
            try {
                const data = await breedService.getAllVMs();
                setBreedsVMList(data);
            } catch (error) {
                alert(error);
                setBreedsVMList([]);
            }
        }
        fetchBreeds();
    }, []);
    
    return (
        <div className={styles.list}>
            {breedsVMList.length > 0 ? (
                breedsVMList.map((breed) => (
                    <div key={breed.id} className={styles.card}>
                        <div className={styles.cardHeader}>
                            <h2 className={styles.breedName}>{breed.name}</h2>
                        </div>
                        <div className={styles.cardBody}>
                            <p><strong>{t("breedsList.feedHeader")}:</strong> {breed.feedName}</p>
                            <p><strong>{t("breedsList.sheepCountHeader")}:</strong> {breed.sheepCount}</p>
                            <p><strong>{t("breedsList.infoHeader")}:</strong> {breed.info}</p>
                        </div>
                    </div>
                ))
            ) : (
                <p>{t("breedsList.notFoundHeader")}</p>
            )}
        </div>
    );
}
