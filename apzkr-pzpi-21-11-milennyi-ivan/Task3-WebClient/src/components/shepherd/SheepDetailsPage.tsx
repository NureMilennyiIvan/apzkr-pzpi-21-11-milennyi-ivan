import { useEffect, useState } from "react";
import { SheepService } from "../../api/services/SheepService";
import { useTranslation } from "react-i18next";
import { SheepDetailsVM } from "../../viewModels/extraViewModels/SheepDetailsVM";
import { FeedingLog } from "../../models/FeedingLog";
import { FeedingLogService } from "../../api/services/FeedingLogService";
import { ShearingLog } from "../../models/ShearingLog";
import { ShearingLogService } from "../../api/services/ShearingLogService";
import styles from '../../assets/css/SheepDetailsPage.module.css';
import { AuthUser } from "../../utils/AuthUser";

// Інтерфейс для пропсів компоненту SheepDetailsPage
interface ISheepDetailsPage {
    user: AuthUser;
    sheepId: number;
}

// Компонент для відображення деталей окремої вівці
export const SheepDetailsPage: React.FC<ISheepDetailsPage> = ({ user, sheepId }) => {
    const sheepService = new SheepService();
    const feedingLogService = new FeedingLogService();
    const shearingLogService = new ShearingLogService();
    const [sheepDetails, setSheepDetails] = useState<SheepDetailsVM | null>(null); // Стан для зберігання деталей вівці
    const [trigger, setTrigger] = useState<boolean>(true); // Стан для тригера повторного завантаження деталей
    const [woolAmount, setWoolAmount] = useState<string>(''); // Стан для введення кількості вовни
    const [errorMessage, setErrorMessage] = useState<string>(''); // Стан для зберігання повідомлень про помилки
    const { t } = useTranslation(); // Використання i18n для багатомовності

    // Використання useEffect для завантаження деталей вівці при першому рендері і зміні тригера
    useEffect(() => {
        const fetchSheepDetails = async () => {
            try {
                const data = await sheepService.getDetailsById(sheepId);
                setErrorMessage('');
                setWoolAmount('');
                setSheepDetails(data);
            } catch (error) {
                alert(error);
                setSheepDetails(null);
            }
        }
        fetchSheepDetails();
    }, [trigger]);

    // Функція для створення запису годування
    const createFeedingLog = async (details: SheepDetailsVM) => {
        try {
            const feedingLog = new FeedingLog(null, sheepId, user.Id!, new Date().getTime(), details.feedId, Math.floor(details.requiredFeedAmount * 1000));
            await feedingLogService.create(feedingLog);
            setTrigger(!trigger);
        } catch (error) {
            console.log(error);
            setErrorMessage("sheepDetailsList.serverErrorHeader");
        }
    }

    // Функція для створення запису стрижки
    const createShearingLog = async () => {
        if (woolAmount.length === 0 || !(/^(0|[1-9]\d*)$/.test(woolAmount))) {
            setErrorMessage("sheepDetailsList.shearingErrorHeader");
            return;
        }
        setErrorMessage('');
        try {
            const shearingLog = new ShearingLog(null, sheepId, user.Id!, new Date().getTime(), Math.floor(parseInt(woolAmount) * 1000));
            await shearingLogService.create(shearingLog);
            setTrigger(!trigger);
        } catch (error) {
            console.log(error);
            setErrorMessage("sheepDetailsList.serverErrorHeader");
        }
    };

    return (
        <div className={styles.container}>
            {sheepDetails ? (
                <div>
                    <div className={styles.cardHeader}>
                        <h2 className={styles.sheepId}>{t("sheepDetailsList.sheepHeader")} #{sheepDetails.id}</h2>
                    </div>
                    <div className={styles.details}>
                        <div className={styles.infoGroup}>
                        <div className={styles.infoItem}>
                            <p><strong>{t("sheepDetailsList.breedHeader")}:</strong> {sheepDetails.breed}</p>
                        </div>
                        <div className={styles.infoItem}>
                            <p><strong>{t("sheepDetailsList.ageHeader")}:</strong> {sheepDetails.age} {t("sheepDetailsList.ageUnitsHeader")}</p>
                        </div>
                        <div className={styles.infoItem}>
                            <p><strong>{t("sheepDetailsList.sexHeader")}:</strong> {t(sheepDetails.sex ? 'sheepDetailsList.maleText' : 'sheepDetailsList.femaleText')}</p>
                        </div>
                        <div className={styles.infoItem}>
                            <div className={styles.temperature}>
                                <p><strong>{t("sheepDetailsList.temperatureHeader")}:</strong> {sheepDetails.temperature ? `${sheepDetails.temperature} °C` : `${t("sheepDetailsList.noDataHeader")}`}</p>
                            </div>
                            {sheepDetails.temperature !== null ? (
                                <p>{t(sheepDetails.temperature >= 36 && sheepDetails.temperature <= 37.5 ? 'sheepDetailsList.temperatureStatusHeader1' : 'sheepDetailsList.temperatureStatusHeader2')}</p>
                            ) : (
                                <p>{t("sheepDetailsList.temperatureStatusHeader3")}</p>
                            )}
                        </div>
                        <div className={styles.infoItem}>
                            <p><strong>{t("sheepDetailsList.weightHeader")}:</strong> {sheepDetails.weight} {t("sheepDetailsList.weightUnitsHeader")}</p>
                        </div>
                        <div className={styles.infoItem}>
                            <p><strong>{t("sheepDetailsList.feedHeader")}:</strong> {sheepDetails.feedName}</p>
                        </div>
                        <div className={styles.infoItem}>
                            <p><strong>{t("sheepDetailsList.availableFeedHeader")}:</strong> {sheepDetails.availableFeedAmount} {t("sheepDetailsList.weightUnitsHeader")}</p>
                        </div>
                    </div>
                    <div className={styles.statusGroup}>
                        <div className={styles.infoItem}>
                            <p><strong>{t("sheepDetailsList.requiredFeedHeader")}:</strong> {sheepDetails.requiredFeedAmount} {t("sheepDetailsList.weightUnitsHeader")}</p>
                        </div>
                        <div className={styles.infoItem}>
                            <div className={styles.feeding}>
                                <p><strong>{t("sheepDetailsList.lastFeedingHeader")}:</strong> {sheepDetails.lastFeedingDate ? sheepDetails.lastFeedingDate : `${t("sheepDetailsList.noDataHeader")}`}</p>                       
                            </div>
                            {sheepDetails.isFeed ? (
                                <div>
                                    {sheepDetails.requiredFeedAmount <= sheepDetails.availableFeedAmount ? ( 
                                        <div className={styles.form}>
                                            <button className={styles.button} onClick={() => createFeedingLog(sheepDetails)}>{t("sheepDetailsList.feedButtonText")}</button>
                                        </div>
                                    ) : (                                
                                        <p>{t("sheepDetailsList.feedingStatusHeader1")}</p>
                                     )}
                                </div>

                            ) : (
                                <p>{t("sheepDetailsList.feedingStatusHeader2")}</p>
                            )}
                        </div>
                        <div className={styles.infoItem}>
                            <div className={styles.shearing}>
                                <p><strong>{t("sheepDetailsList.lastShearingHeader")}:</strong> {sheepDetails.lastShearingDate ? sheepDetails.lastShearingDate : `${t("sheepDetailsList.noDataHeader")}`}</p>
                            </div>
                            {sheepDetails.isShear ? (
                                <div>
                                    <input className={styles.input} type="text" value={woolAmount} onChange={(e) => setWoolAmount(e.target.value)} placeholder={t("sheepDetailsList.shearingInputPlaceholder")} />

                                    <button className={styles.button} onClick={() => createShearingLog()}>{t("sheepDetailsList.shearButtonText")}</button>
                                </div>
                            ) : (
                                <p>{t("sheepDetailsList.shearingStatusHeader")}</p>
                            )}
                        </div>
                        <div className={styles.errorItem}>
                            {errorMessage && <span className={styles.error}>{t(errorMessage)}</span>}
                        </div>
                    </div>

                </div>
                <div className={styles.infoItem}>
                    <p><strong>{t("sheepDetailsList.breedInfoHeader")}:</strong> {sheepDetails.breedInfo}</p>
                </div>
            </div>
            ) : (
                <p>{t("sheepDetailsList.notFoundHeader")}</p>
            )}
        </div>
    )
}
