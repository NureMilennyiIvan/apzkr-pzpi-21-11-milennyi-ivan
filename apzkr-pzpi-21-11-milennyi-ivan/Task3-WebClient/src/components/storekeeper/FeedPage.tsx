import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import { useEffectUser } from "../../utils/helpers";
import { useState } from "react";
import { IUserProps } from "../properties/IUserProps";
import { FeedingLogsListFeed } from "./FeedingLogsListFeed";
import { FeedSuppliesList } from "./FeedSuppliesList";
import styles from "../../assets/css/FeedPage.module.css";

// Компонент для сторінки корму
export const FeedPage: React.FC<IUserProps> = ({ user }) => {
    const [selectedButton, setSelectedButton] = useState<number>(1); // Стан для зберігання вибраної кнопки
    const { feedId } = useParams(); // Отримання ідентифікатора корму з параметрів URL
    const [content, setContent] = useState<JSX.Element>(<FeedSuppliesList feedId={parseInt(feedId!)} />); // Стан для зберігання вибраного контенту
    const { t } = useTranslation(); // Використання i18n для багатомовності
    const navigate = useNavigate();
    useEffectUser(user, navigate); // Використання хука для перевірки користувача та навігації

    // Функція для обробки натискання кнопки
    const handleButtonClick = (buttonIndex: number) => {
        setSelectedButton(buttonIndex);
        switch (buttonIndex) {
            case 1:
                setContent(<FeedSuppliesList feedId={parseInt(feedId!)} />);
                break;
            case 2:
                setContent(<FeedingLogsListFeed feedId={parseInt(feedId!)} />);
                break;
            default:
                break;
        }
    }
    
    return(
        <div className={styles.container}>
            <div className={styles.buttonPanel}>
                    <button className={styles.button} style={{ backgroundColor: selectedButton === 1 ? 'rgb(238, 238, 238)' : 'white' }} onClick={() => handleButtonClick(1)}>
                        <h4 >{t("feedPage.suppliesHeader")}</h4> 
                    </button>

                    <button className={styles.button} style={{ backgroundColor: selectedButton === 2 ? 'rgb(238, 238, 238)' : 'white' }} onClick={() => handleButtonClick(2)}>
                        <h4 >{t("feedPage.consumptionsHeader")}</h4> 
                    </button>
            </div>
            <div className={styles.content}>
                {content}
            </div>
      </div>
    )
}