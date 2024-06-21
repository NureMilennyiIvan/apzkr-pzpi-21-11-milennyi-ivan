import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { handleElementChange, hashPassword, useEffectUser } from "../../utils/helpers";
import styles from "../../assets/css/AdminBaseForm.module.css";
import { ShepherdService } from "../../api/services/ShepherdService";
import { StorekeeperService } from "../../api/services/StorekeeperService";
import { SheepService } from "../../api/services/SheepService";
import { FeedService } from "../../api/services/FeedService";
import { BreedService } from "../../api/services/BreedService";
import { TemperatureScannerService } from "../../api/services/TemperatureScannerService";
import { IUserProps } from "../properties/IUserProps";

// Інтерфейс для пропсів компоненту, що розширює IUserProps і додає entityType
interface FormProps extends IUserProps {
  entityType: "Shepherd" | "Storekeeper" | "Sheep" | "Feed" | "Breed" | "TemperatureScanner";
}

// Компонент для базової форми адміністратора
export const AdminBaseForm: React.FC<FormProps> = ({ user, entityType }) => {
  const { entityId } = useParams();
  const [formData, setFormData] = useState<any>({});
  const [errors, setErrors] = useState<any>({});
  const [trigger, _setTrigger] = useState(true);
  const navigate = useNavigate();
  const { t } = useTranslation();
  useEffectUser(user, navigate);

  const services = {
    Shepherd: new ShepherdService(),
    Storekeeper: new StorekeeperService(),
    Sheep: new SheepService(),
    Feed: new FeedService(),
    Breed: new BreedService(),
    TemperatureScanner: new TemperatureScannerService(),
  };

   // Використання useEffect для завантаження даних при першому рендері
  useEffect(() => {
    const fetchData = async () => {
      if (entityId) {
        try {
          const data = (await services[entityType].getById(parseInt(entityId as string)))!;
       
          if (entityType  === "Shepherd" || entityType === "Storekeeper" || entityType === "TemperatureScanner") {
            //@ts-ignore
            data.password = "";
          }
          else if (entityType === "Sheep"){
            //@ts-ignore
            const date = new Date(data.birth_date * 1000);
            //@ts-ignore
            data.birth_date = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
            console.log(data);
          }
          setFormData({ ...data });
        } catch (error) {
          alert(error);
        }
      }
    };
    fetchData();
  }, [trigger, entityId]);

    // Обробник події для відправки форми
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validateForm(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setErrors({});
    try {
      const item = {...formData};
      console.log(item)
      switch (entityType) {
        case "Shepherd":
        case "Storekeeper":
          item.password = await hashPassword(item.password);
          break;
        case "Sheep":
          item.birth_date = new Date(item.birth_date).getTime() / 1000;
          break;
        default:
          break;
      }

      if (entityId) {
        await services[entityType].update(item);
      } else {
        await services[entityType].create(item);
      }
      navigate(-1);
    } catch (error) {
      console.log(error);
      setErrors({ submit: "Error saving data" });
    }
  };

    // Валідація форми залежно від entityType
  const validateForm = (data: any): any => {
    const errors: any = {};

    switch (entityType) {
        case "Shepherd":
        case "Storekeeper":
            if (!data.username || data.username.trim().length < 5) {
                errors.username = "adminBaseForm.validationErrors.employeeUsernameRequired";
            }
            if (!data.password || data.password.trim().length < 8) {
                errors.password = "adminBaseForm.validationErrors.employeePasswordRequired";
            }
            if (!data.name || data.name.trim().length === 0) {
                errors.name = "adminBaseForm.validationErrors.employeeNameRequired";
            }
            if (!data.surname || data.surname.trim().length === 0) {
                errors.surname = "adminBaseForm.validationErrors.employeeSurnameRequired";
            }
            break;
        case "Sheep":
            if (!data.birth_date) {
                errors.birth_date = "adminBaseForm.validationErrors.birthDateRequired";
            }
            if (!data.breed_id || isNaN(data.breed_id) || !(/^(0|[1-9]\d*)$/.test(data.breed_id))) {
                errors.breed_id = "adminBaseForm.validationErrors.breedIdRequired";
            }
            if (!data.weight || isNaN(data.weight) || !(/^(0|[1-9]\d*)$/.test(data.weight))) {
                errors.weight = "adminBaseForm.validationErrors.weightRequired";
            }
            if (typeof data.sex !== "boolean") {
                errors.sex = "adminBaseForm.validationErrors.sexRequired";
            }
            break;
        case "Feed":
            if (!data.name || data.name.trim().length < 5) {
                errors.name = "adminBaseForm.validationErrors.feedNameRequired";
            }
            if (!data.amount || isNaN(data.amount) || !(/^(0|[1-9]\d*)$/.test(data.amount))) {
                errors.amount = "adminBaseForm.validationErrors.amountRequired";
            }
            if (!data.calories || isNaN(data.calories) || !(/^(0|[1-9]\d*)$/.test(data.calories))) {
                errors.calories = "adminBaseForm.validationErrors.caloriesRequired";
            }
            if (!data.fat || isNaN(data.fat) || !(/^(0|[1-9]\d*)$/.test(data.fat))) {
                errors.fat = "adminBaseForm.validationErrors.fatRequired";
            }
            if (!data.protein || isNaN(data.protein) || !(/^(0|[1-9]\d*)$/.test(data.protein))) {
                errors.protein = "adminBaseForm.validationErrors.proteinRequired";
            }
            if (!data.carbohydrates || isNaN(data.carbohydrates) || !(/^(0|[1-9]\d*)$/.test(data.carbohydrates))) {
                errors.carbohydrates = "adminBaseForm.validationErrors.carbohydratesRequired";
            }
            break;
        case "Breed":
            if (!data.name || data.name.trim().length < 5) {
                errors.name = "adminBaseForm.validationErrors.breedNameRequired";
            }
            if (!data.feed_id || isNaN(data.feed_id) || !(/^(0|[1-9]\d*)$/.test(data.feed_id))) {
                errors.feed_id = "adminBaseForm.validationErrors.feedIdRequired";
            }
            if (!data.info || data.info.trim().length < 10){
                errors.info = "adminBaseForm.validationErrors.infoRequired";
            }
            break;
        case "TemperatureScanner":
            if (!data.temperature || isNaN(data.temperature)) {
                errors.temperature = "adminBaseForm.validationErrors.temperatureRequired";
            }
            if (!data.password || data.password.trim().length < 8) {
                errors.password = "adminBaseForm.validationErrors.passwordRequired";
            }
            break;
        default:
            break;
    }

    return errors;
};

  // Функція для рендерингу полів форми залежно від entityType
  const renderFormFields = () => {
    switch (entityType) {
      case "Shepherd":
      case "Storekeeper":
        return (
          <>
            <div className={styles.formGroup}>
              <label className={styles.label}>{t("adminBaseForm.headers.employeeUsername")}</label>
              <input
                className={styles.input}
                type="text"
                value={formData.username || ""}
                onChange={(e) => handleElementChange(e, (value) => setFormData({ ...formData, username: value }))}
              />
              {errors.username && <span className={styles.error}>{t(errors.username)}</span>}
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>{t("adminBaseForm.headers.employeePassword")}</label>
              <input
                className={styles.input}
                type="password"
                value={formData.password || ""}
                onChange={(e) => handleElementChange(e, (value) => setFormData({ ...formData, password: value }))}
              />
              {errors.password && <span className={styles.error}>{t(errors.password)}</span>}
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>{t("adminBaseForm.headers.employeeName")}</label>
              <input
                className={styles.input}
                type="text"
                value={formData.name || ""}
                onChange={(e) => handleElementChange(e, (value) => setFormData({ ...formData, name: value }))}
              />
              {errors.name && <span className={styles.error}>{t(errors.name)}</span>}
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>{t("adminBaseForm.headers.employeeSurname")}</label>
              <input
                className={styles.input}
                type="text"
                value={formData.surname || ""}
                onChange={(e) => handleElementChange(e, (value) => setFormData({ ...formData, surname: value }))}
              />
              {errors.surname && <span className={styles.error}>{t(errors.surname)}</span>}
            </div>
          </>
        );
      case "Sheep":
        return (
          <>
            <div className={styles.formGroup}>
              <label className={styles.label}>{t("adminBaseForm.headers.sheepBirthDate")}</label>
              <input
                className={styles.input}
                type="date"
                value={formData.birth_date || ""}
                onChange={(e) => handleElementChange(e, (value) => setFormData({ ...formData, birth_date: value }))}
              />
              {errors.birth_date && <span className={styles.error}>{t(errors.birth_date)}</span>}
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>{t("adminBaseForm.headers.sheepBreedId")}</label>
              <input
                className={styles.input}
                type="number"
                value={formData.breed_id || ""}
                onChange={(e) => handleElementChange(e, (value) => setFormData({ ...formData, breed_id: value }))}
              />
              {errors.breed_id && <span className={styles.error}>{t(errors.breed_id)}</span>}
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>{t("adminBaseForm.headers.sheepWeight")}</label>
              <input
                className={styles.input}
                type="number"
                value={formData.weight || ""}
                onChange={(e) => handleElementChange(e, (value) => setFormData({ ...formData, weight: value }))}
              />
              {errors.weight && <span className={styles.error}>{t(errors.weight)}</span>}
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>{t("adminBaseForm.headers.sheepSex")}</label>
              <select
                className={styles.input}
                value={formData.sex || ""}
                onChange={(e) => handleElementChange(e, (value) => setFormData({ ...formData, sex: value }))}
              >
                <option value="true">{t("adminBaseForm.headers.maleText")}</option>
                <option value="false">{t("adminBaseForm.headers.femaleText")}</option>
              </select>
              {errors.sex && <span className={styles.error}>{t(errors.sex)}</span>}
            </div>
          </>
        );
      case "Feed":
        return (
          <>
            <div className={styles.formGroup}>
              <label className={styles.label}>{t("adminBaseForm.headers.feedName")}</label>
              <input
                className={styles.input}
                type="text"
                value={formData.name || ""}
                onChange={(e) => handleElementChange(e, (value) => setFormData({ ...formData, name: value }))}
              />
              {errors.name && <span className={styles.error}>{t(errors.name)}</span>}
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>{t("adminBaseForm.headers.feedAmount")}</label>
              <input
                className={styles.input}
                type="number"
                value={formData.amount || ""}
                onChange={(e) => handleElementChange(e, (value) => setFormData({ ...formData, amount: value }))}
              />
              {errors.amount && <span className={styles.error}>{t(errors.amount)}</span>}
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>{t("adminBaseForm.headers.feedCalories")}</label>
              <input
                className={styles.input}
                type="number"
                value={formData.calories || ""}
                onChange={(e) => handleElementChange(e, (value) => setFormData({ ...formData, calories: value }))}
              />
              {errors.calories && <span className={styles.error}>{t(errors.calories)}</span>}
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>{t("adminBaseForm.headers.feedFat")}</label>
              <input
                className={styles.input}
                type="number"
                value={formData.fat || ""}
                onChange={(e) => handleElementChange(e, (value) => setFormData({ ...formData, fat: value }))}
              />
              {errors.fat && <span className={styles.error}>{t(errors.fat)}</span>}
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>{t("adminBaseForm.headers.feedProtein")}</label>
              <input
                className={styles.input}
                type="number"
                value={formData.protein || ""}
                onChange={(e) => handleElementChange(e, (value) => setFormData({ ...formData, protein: value }))}
              />
              {errors.protein && <span className={styles.error}>{t(errors.protein)}</span>}
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>{t("adminBaseForm.headers.feedCarbohydrates")}</label>
              <input
                className={styles.input}
                type="number"
                value={formData.carbohydrates || ""}
                onChange={(e) => handleElementChange(e, (value) => setFormData({ ...formData, carbohydrates: value }))}
              />
              {errors.carbohydrates && <span className={styles.error}>{t(errors.carbohydrates)}</span>}
            </div>
          </>
        );
      case "Breed":
        return (
          <>
            <div className={styles.formGroup}>
              <label className={styles.label}>{t("adminBaseForm.headers.breedName")}</label>
              <input
                className={styles.input}
                type="text"
                value={formData.name || ""}
                onChange={(e) => handleElementChange(e, (value) => setFormData({ ...formData, name: value }))}
              />
              {errors.name && <span className={styles.error}>{t(errors.name)}</span>}
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>{t("adminBaseForm.headers.breedFeedId")}</label>
              <input
                className={styles.input}
                type="number"
                value={formData.feed_id || ""}
                onChange={(e) => handleElementChange(e, (value) => setFormData({ ...formData, feed_id: value }))}
              />
              {errors.feed_id && <span className={styles.error}>{t(errors.feed_id)}</span>}
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>{t("adminBaseForm.headers.breedInfoHeader")}</label>
              <textarea
                className={styles.input}
                value={formData.info || ""}
                onChange={(e) => handleElementChange(e, (value) => setFormData({ ...formData, info: value }))}
              />
              {errors.info && <span className={styles.error}>{t(errors.info)}</span>}
            </div>
          </>
        );
      case "TemperatureScanner":
        return (
          <>
            <div className={styles.formGroup}>
              <label className={styles.label}>{t("adminBaseForm.headers.temperatureScannerTemperature")}</label>
              <input
                className={styles.input}
                type="number"
                value={formData.temperature || ""}
                onChange={(e) => handleElementChange(e, (value) => setFormData({ ...formData, temperature: value }))}
              />
              {errors.temperature && <span className={styles.error}>{t(errors.temperature)}</span>}
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>{t("adminBaseForm.headers.temperatureScannerPassword")}</label>
              <input
                className={styles.input}
                type="password"
                value={formData.password || ""}
                onChange={(e) => handleElementChange(e, (value) => setFormData({ ...formData, password: value }))}
              />
              {errors.password && <span className={styles.error}>{t(errors.password)}</span>}
            </div>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.form}>
        <form onSubmit={handleSubmit}>
          {renderFormFields()}
          {errors.submit && <span className={styles.error}>{t(errors.submit)}</span>}
          <div className={styles.actionButtonsContainer}>
            <button type="submit" className={styles.actionButton}>
              {entityId ? t("adminBaseForm.editButtonText") : t("adminBaseForm.createButtonText")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

