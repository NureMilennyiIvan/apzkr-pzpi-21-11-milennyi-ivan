import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import { ShepherdService } from "../../api/services/ShepherdService";
import { SheepService } from "../../api/services/SheepService";
import styles from "../../assets/css/ReassignFormForSheep.module.css";
import { IUserProps } from "../properties/IUserProps";
import { useEffectUser } from "../../utils/helpers";
import { TemperatureScannerService } from "../../api/services/TemperatureScannerService";

// Інтерфейс для пропсів компоненту, що розширює IUserProps і додає entityType
interface FormProps extends IUserProps {
  entityType: "Shepherd" | "TemperatureScanner";
}

// Компонент для форми переназначення вівці на пастуха або сканер температури
export const ReassignFormForSheep: React.FC<FormProps> = ({user, entityType}) => {
  const [entitiesList, setEntitiesList] = useState<any[]>([]); // Стан для списку сутностей
  const [selectedEntityId, setSelectedEntityId] = useState<number | null>(null); // Стан для вибраної сутності
  const sheepId = parseInt(useParams().sheepId!); // Отримання ID вівці з URL параметрів
  const navigate = useNavigate(); // Використання useNavigate для навігації
  const { t } = useTranslation(); // Використання i18n для багатомовності

  const services = {
    Shepherd: new ShepherdService(),
    TemperatureScanner: new TemperatureScannerService(),
  };

  // Перевірка авторизації користувача
  useEffectUser(user, navigate);

  // Функція для отримання списку сутностей залежно від entityType
  const getEntitiesPromise = (): Promise<any> => {
    switch (entityType) {
      case "Shepherd":
        return services.Shepherd.getAllVMs();
      case "TemperatureScanner":
        return services.TemperatureScanner.getAllUnassignedScannersIds();
    }
  }

  // Використання useEffect для завантаження списку сутностей при першому рендері
  useEffect(() => {
    const fetchShepherds = async () => {
      try {
        const data = await getEntitiesPromise();
        setEntitiesList(data); // Оновлення стану списку сутностей
      } catch (error) {
        console.error(error);
        setEntitiesList([]); // Очищення стану списку сутностей у разі помилки
      }
    };

    fetchShepherds();
  }, []);

  // Обробник події для відправки форми
  const handleSubmit = async () => {
    const sheepService = new SheepService();
    try {
      // Виконання дії переназначення залежно від entityType
      switch (entityType) {
        case "Shepherd":
          await sheepService.changeShepherd(sheepId, selectedEntityId);
          break;
        case "TemperatureScanner":
          await sheepService.changeTemperatureScanner(sheepId, selectedEntityId);
          break;
      }
      navigate(-1); // Повернення на попередню сторінку після успішного переназначення
    } catch (error) {
      console.error(error);
    }
  };

  // Функція для рендерингу полів форми залежно від entityType
  const renderFormFields = () => {
    switch (entityType) {
      case "Shepherd":
        return(<>
          <label className={styles.inputLabel}>{t("reassignFormForSheep.shepherdsHeader")}</label>
          <select
            className={styles.select}
            value={selectedEntityId ?? ""}
            onChange={(e) => setSelectedEntityId(e.target.value === "" ? null : parseInt(e.target.value))}
          >
            <option value="">{t("reassignFormForSheep.dontAssignOption")}</option>
            {entitiesList.map((entity) => (
              <option key={entity.id} value={entity.id!}>
                {entity.name} {entity.surname}
              </option>
            ))}
          </select>
        </>)
      case "TemperatureScanner":
        return(<>
          <label className={styles.inputLabel}>{t("reassignFormForSheep.temperatureScannersHeader")}</label>
          <select
            className={styles.select}
            value={selectedEntityId ?? ""}
            onChange={(e) => setSelectedEntityId(e.target.value === "" ? null : parseInt(e.target.value))}
          >
            <option value="">{t("reassignFormForSheep.dontAssignOption")}</option>
            {entitiesList.map((id) => (
              <option key={id} value={id!}>
                {`${t("reassignFormForSheep.scannerHeader")}${id}`}
              </option>
            ))}
          </select>
        </>)
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.form}>
        <div className={styles.labelContainer}>
          <label className={styles.label}>{`${t("reassignFormForSheep.sheepHeader")}${sheepId}`}</label>
        </div>
        <div className={styles.inputContainer}>
          {renderFormFields()}
        </div>
        <button className={styles.button} onClick={handleSubmit}>
          {t("reassignFormForSheep.assignTextButton")}
        </button>
      </div>
    </div>
  );
};

