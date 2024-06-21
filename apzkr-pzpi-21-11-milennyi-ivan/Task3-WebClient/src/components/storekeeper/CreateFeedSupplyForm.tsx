import { useState } from "react";
import { IUserProps } from "../properties/IUserProps";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useEffectUser } from "../../utils/helpers";
import { FeedSupply } from "../../models/FeedSupply";
import { FeedSupplyService } from "../../api/services/FeedSupplyService";
import styles from '../../assets/css/CreateFeedSupplyForm.module.css';

// Компонент для форми створення постачання корму
export const CreateFeedSupplyForm: React.FC<IUserProps> = ({ user }) => {
    const [amount, setAmount] = useState<string>(''); // Стан для зберігання кількості постачання
    const [errorAmount, setErrorAmount] = useState<string>(''); // Стан для зберігання повідомлення про помилки
    const { feedId } = useParams(); // Отримання ідентифікатора корму з параметрів URL
    const feedSupplyService = new FeedSupplyService();

    const navigate = useNavigate();
    const { t } = useTranslation(); // Використання i18n для багатомовності
    useEffectUser(user, navigate); // Використання хука для перевірки користувача та навігації

    // Функція для створення постачання корму
    const createFeedSupply = async () => {
        if (amount.length === 0 || !(/^(0|[1-9]\d*)$/.test(amount))) {
            setErrorAmount("inputErrorHeader");
            return;
        }
        setErrorAmount('');
        try {
            // Створення нового об'єкта FeedSupply
            const feedSupply = new FeedSupply(null, user.Id!, parseInt(amount) * 1000, new Date().getTime(), parseInt(feedId!));
            await feedSupplyService.create(feedSupply); // Виклик сервісу для створення постачання
            navigate(-1); // Повернення до попередньої сторінки після успішного створення
        } catch (error) {
            console.log(error);
            setErrorAmount("serverErrorHeader");
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.form}>
                <div>
                    <div className={styles.label}>
                        <label >{t("createFeedSupplyForm.supplyAmountLabel")}</label>
                    </div>
                    <input className={styles.input} type="text" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder={t("createFeedSupplyForm.inputPlaceholder")} />
                    <div className={styles.error}>
                        {errorAmount && <span>{t(errorAmount)}</span>}
                    </div>
                </div>
                <div>
                    <button className={styles.button} onClick={createFeedSupply}>{t("createFeedSupplyForm.supplyButtonText")}</button>
                </div>
            </div>
        </div>
    )
}
