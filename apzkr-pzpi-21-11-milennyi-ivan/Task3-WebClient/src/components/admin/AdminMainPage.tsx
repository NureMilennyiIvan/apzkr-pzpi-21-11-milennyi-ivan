import { useTranslation } from "react-i18next";
import styles from "../../assets/css/AdminMainPage.module.css";
import { useState } from "react";
import { ShepehrdsGrid } from "./dataGrids/ShepherdsGrid";
import { StorekeepersGrid } from "./dataGrids/StorekeepersGrid";
import { SheepGrid } from "./dataGrids/SheepGrid";
import { TemperatureScannersGrid } from "./dataGrids/TemepratureScannersGrid";
import { BreedsGrid } from "./dataGrids/BreedsGrid";
import { FeedsGrid } from "./dataGrids/FeedsGrid";
import { FeedingLogsGrid } from "./dataGrids/FeedingLogsGrid";
import { ShearingLogsGrid } from "./dataGrids/ShearingLogsGrid";
import { FeedSuppliesGrid } from "./dataGrids/FeedSuppliesLogs";

// Компонент головної сторінки адміністратора
export const AdminMainPage = () => {
    const { t } = useTranslation();
    const [selectedButton, setSelectedButton] = useState<number>(1); // Стан для зберігання вибраної кнопки
    const [content, setContent] = useState<JSX.Element>(<ShepehrdsGrid />); // Стан для зберігання вибраного контенту

    // Функція для обробки натискання кнопки
    const handleButtonClick = (buttonIndex: number) => {
        setSelectedButton(buttonIndex);
        switch(buttonIndex) {
            case 1:
                setContent(<ShepehrdsGrid/>);
                break;
            case 2:
                setContent(<StorekeepersGrid/>);
                break;
            case 3:
                setContent(<SheepGrid/>);
                break;
            case 4:
                setContent(<TemperatureScannersGrid/>);
                break;
            case 5:
                setContent(<BreedsGrid/>);
                break;
            case 6:
                setContent(<FeedsGrid/>);
                break;
            case 7:
                setContent(<FeedingLogsGrid/>);
                break;
            case 8:
                setContent(<ShearingLogsGrid/>);
                break;
            case 9:
                setContent(<FeedSuppliesGrid/>);
                break;
            default:
                break;
        }
    }
    
    return (
        <div className={styles.container}>
        <div className={styles.buttonPanel}>
            <button className={styles.button} style={{ backgroundColor: selectedButton === 1 ? 'rgb(238, 238, 238)' : 'white' }} onClick={() => handleButtonClick(1)}>
                <h4>{t("adminMainPage.shepeherdsHeader")}</h4> 
            </button>
            <button className={styles.button} style={{ backgroundColor: selectedButton === 2 ? 'rgb(238, 238, 238)' : 'white' }} onClick={() => handleButtonClick(2)}>
                <h4>{t("adminMainPage.storekeepersHeader")}</h4> 
            </button>
            <button className={styles.button} style={{ backgroundColor: selectedButton === 3 ? 'rgb(238, 238, 238)' : 'white' }} onClick={() => handleButtonClick(3)}>
                <h4>{t("adminMainPage.sheepHeader")}</h4> 
            </button>
            <button className={styles.button} style={{ backgroundColor: selectedButton === 4 ? 'rgb(238, 238, 238)' : 'white' }} onClick={() => handleButtonClick(4)}>
                <h4>{t("adminMainPage.temperatureScannersHeader")}</h4> 
            </button>
            <button className={styles.button} style={{ backgroundColor: selectedButton === 5 ? 'rgb(238, 238, 238)' : 'white' }} onClick={() => handleButtonClick(5)}>
                <h4>{t("adminMainPage.breedsHeader")}</h4> 
            </button>
            <button className={styles.button} style={{ backgroundColor: selectedButton === 6 ? 'rgb(238, 238, 238)' : 'white' }} onClick={() => handleButtonClick(6)}>
                <h4>{t("adminMainPage.feedsHeader")}</h4> 
            </button>
            <button className={styles.button} style={{ backgroundColor: selectedButton === 7 ? 'rgb(238, 238, 238)' : 'white' }} onClick={() => handleButtonClick(7)}>
                <h4>{t("adminMainPage.feedingLogsHeader")}</h4> 
            </button>
            <button className={styles.button} style={{ backgroundColor: selectedButton === 8 ? 'rgb(238, 238, 238)' : 'white' }} onClick={() => handleButtonClick(8)}>
                <h4>{t("adminMainPage.shearingLogsHeader")}</h4> 
            </button>
            <button className={styles.button} style={{ backgroundColor: selectedButton === 9 ? 'rgb(238, 238, 238)' : 'white' }} onClick={() => handleButtonClick(9)}>
                <h4>{t("adminMainPage.feedSuppliesHeader")}</h4> 
            </button>
        </div>
        <div className={styles.content}>
            {content}
        </div>
    </div>
    )
}