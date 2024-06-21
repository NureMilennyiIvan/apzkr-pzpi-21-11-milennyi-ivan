import { useNavigate, useParams } from "react-router-dom";
import { IUserProps } from "../properties/IUserProps";
import { useTranslation } from "react-i18next";
import { useEffectUser } from "../../utils/helpers";
import { SheepDetailsPage } from "./SheepDetailsPage";
import { useState } from "react";
import { FeedingLogsListSheep } from "./FeedingLogsListSheep";
import { ShearingLogsList } from "./ShearingLogsList";
import styles from '../../assets/css/SheepMainPage.module.css';

// Компонент головної сторінки для окремої вівці
export const SheepMainPage: React.FC<IUserProps> = ({ user }) => {
    const sheepId = parseInt(useParams().sheepId!); // Отримання ідентифікатора вівці з параметрів URL
    const [selectedButton, setSelectedButton] = useState<number>(1); // Стан для зберігання вибраної кнопки
    const [content, setContent] = useState<JSX.Element>(<SheepDetailsPage user={user} sheepId={sheepId} />); // Стан для зберігання вибраного контенту

    const { t } = useTranslation(); // Використання i18n для багатомовності
    const navigate = useNavigate();
    useEffectUser(user, navigate); // Використання хука для перевірки користувача та навігації

    // Обробка натискання кнопки
    const handleButtonClick = (buttonIndex: number) => {
        setSelectedButton(buttonIndex);
        switch (buttonIndex) {
            case 1:
                setContent(<SheepDetailsPage user={user} sheepId={sheepId} />);
                break;
            case 2:
                setContent(<FeedingLogsListSheep sheepId={sheepId} />);
                break;
            case 3:
                setContent(<ShearingLogsList sheepId={sheepId} />);
                break;
            default:
                break;
        }
    }

    
    return (
        <div className={styles.container}>
            <div className={styles.buttonPanel}>

                    <button className={styles.button} style={{ backgroundColor: selectedButton === 1 ? 'rgb(238, 238, 238)' : 'white' }} onClick={() => handleButtonClick(1)}>
                        <h4>{t("sheepMainPage.sheepDetailsHeader")}</h4> 
                    </button>

                    <button className={styles.button} style={{ backgroundColor: selectedButton === 2 ? 'rgb(238, 238, 238)' : 'white' }} onClick={() => handleButtonClick(2)}>
                        <h4>{t("sheepMainPage.feedingLogsHeader")}</h4> 
                    </button>

                    <button className={styles.button} style={{ backgroundColor: selectedButton === 3 ? 'rgb(238, 238, 238)' : 'white' }} onClick={() => handleButtonClick(3)}>
                        <h4>{t("sheepMainPage.shearingLogsHeader")}</h4> 
                    </button>
            </div>
            <div className={styles.content}>
                {content}
            </div>
        </div>
    );
}
