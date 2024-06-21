import { useEffect, useState } from "react";
import { BreedService } from "../../../api/services/BreedService";
import styles from "../../../assets/css/GridComponent.module.css"
import { Breed } from "../../../models/Breed";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

// Компонент для відображення таблиці з породами
export const BreedsGrid = () => {
    const breedService = new BreedService();
    const [selectedBreed, setSelectedBreed] = useState<Breed | null>(null); // Стан для зберігання вибраної породи
    const [breeds, setBreeds] = useState<Breed[]>([]); // Стан для зберігання списку порід
    const [trigger, setTrigger] = useState<boolean>(true); // Стан для тригеру оновлення даних

    const { t } = useTranslation(); // Використання i18n для багатомовності
    const navigate = useNavigate();

    // Використання useEffect для завантаження списку порід при першому рендері та при зміні тригеру
    useEffect(() => {
        const fetchBreeds = async () => {
            try {
                // Отримання даних порід від сервісу BreedService
                const data = await breedService.getAll();
                setBreeds(data); // Оновлення стану списку порід
            } catch (error) {
                alert(error);
                setBreeds([]); // Очищення стану списку порід у разі помилки
            }
        };
        fetchBreeds();
    }, [trigger]); // Виконання ефекту при зміні тригеру

    // Функція для обробки вибору рядка таблиці
    const handleRowSelection = (breed: Breed) => {
        setSelectedBreed(breed);
    };

    // Функція для переходу на сторінку створення нової породи
    const createBreed = () => {
        navigate("/breed/create");
    }

    // Функція для переходу на сторінку редагування вибраної породи
    const editBreed = (id: number) => {
        navigate("/breed/edit/" + id);
    }

    // Функція для видалення вибраної породи
    const deleteBreed = async (id: number) => {
        try {
            await breedService.delete(id);
            setSelectedBreed(null); // Очистити вибір після видалення
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
                        <th className={styles.th}>{t("breedsGrid.nameHeader")}</th>
                        <th className={styles.th}>{t("breedsGrid.feedIdHeader")}</th>
                        <th className={styles.th}>{t("breedsGrid.infoHeader")}</th>
                    </tr>
                </thead>
                <tbody>
                    {breeds.length != 0 ? (
                        breeds.map((breed) => (
                            <tr key={breed.id} 
                                className={`${styles.tr} ${selectedBreed?.id === breed.id ? styles.selected : ''}`}>
                                <td className={styles.td}>
                                    <input
                                        type="radio"
                                        name="selectedUser"
                                        checked={selectedBreed?.id === breed.id}
                                        onChange={() => handleRowSelection(breed)}
                                    />
                                </td>
                                <td className={styles.td}>{breed.id}</td>
                                <td className={styles.td}>{breed.name}</td>
                                <td className={styles.td}>{breed.feed_id}</td>
                                <td className={styles.td}>{breed.info}</td>
                            </tr>
                        ))
                    ) : (
                        <div className={styles.error}>{t("cityGrid.errorHeader")}</div>
                    )}
                </tbody>
            </table>
            <div className={styles.actionButtonsContainer}>
                <button className={styles.actionButton} onClick={() => createBreed()}>
                    {t("gridBase.addButtonText")}
                </button>
                <button 
                    className={`${styles.actionButton} ${selectedBreed?.id ? '' : styles.disabledButton}`}
                    onClick={() => selectedBreed ? editBreed(selectedBreed.id!) : undefined}
                    style={{ cursor: selectedBreed ? 'pointer' : 'default' }}>
                    {t("gridBase.editButtonText")}
                </button>
                <button 
                    className={`${styles.actionButton} ${selectedBreed?.id ? '' : styles.disabledButton}`}
                    onClick={() => selectedBreed ? deleteBreed(selectedBreed.id!) : undefined}
                    style={{ cursor: selectedBreed ? 'pointer' : 'default' }}>
                    {t("gridBase.deleteButtonText")}
                </button>
            </div>
        </div>
    );
}