import { useState } from "react";
import { ShepherdService } from "../../api/services/ShepherdService";
import { StorekeeperService } from "../../api/services/StorekeeperService";
import { UserRole } from "../../utils/UserRole";
import { IUserProps } from "../properties/IUserProps";
import { useTranslation } from "react-i18next";
import { handleElementChange, hashPassword, saveAuthUserToLocalStorage } from "../../utils/helpers";
import { AuthUser } from "../../utils/AuthUser";
import styles from "../../assets/css/AuthorizationForm.module.css";
import { checkAdmin } from "../admin/check-admin";


// Компонент форми авторизації
const AuthorizationForm: React.FC<IUserProps> = ({ setUser }) => {
    const shepherdService = new ShepherdService();
    const storekeeperService = new StorekeeperService();
    const [username, setUsername] = useState(''); // Стан для зберігання введеного користувачем
    const [password, setPassword] = useState(''); // Стан для зберігання введеного пароля
    const [role, setRole] = useState<UserRole>(UserRole.Shepherd); // Стан для зберігання вибраної ролі

    const [errorUsername, setErrorUsername] = useState(''); // Стан для зберігання помилок введення користувача
    const [errorPassword, setErrorPassword] = useState(''); // Стан для зберігання помилок введення пароля

    const { t } = useTranslation(); // Використання i18n для багатомовності

    // Функція для входу користувача
    const signIn = async () => {
        // Перевірка введеного імені користувача
        if (username.length < 1) {
            setErrorUsername("authorizationForm.errorUsernameHeader1");
            return;
        } else {
            setErrorUsername('');
        }

        // Перевірка введеного пароля
        if (password.length < 1) {
            setErrorPassword("authorizationForm.errorPasswordHeader");
            return;
        } else {
            setErrorPassword('');
        }

        // Хешування пароля
        const hashedPassword = await hashPassword(password);

        // Перевірка на адміністратора
        if (checkAdmin(username, hashedPassword)) {
            let user = new AuthUser(-1, UserRole.Admin);
            saveAuthUserToLocalStorage("user", user);
            setUser(user);
        } 
        // Авторизація пастуха
        else if (role === UserRole.Shepherd) {
            try {
                const authorizedShepherd = await shepherdService.authorize(username, hashedPassword);
                if (authorizedShepherd) {
                    let user = new AuthUser(authorizedShepherd.id, UserRole.Shepherd);
                    saveAuthUserToLocalStorage("user", user);
                    setUser(user);
                    return;
                }
                throw new Error();
            } catch (error) {
                setErrorUsername("authorizationForm.errorUsernameHeader2");
            }
        } 
        // Авторизація комірника
        else if (role === UserRole.Storekeeper) {
            try {
                const authorizedStorekeeper = await storekeeperService.authorize(username, hashedPassword);
                if (authorizedStorekeeper) {
                    let user = new AuthUser(authorizedStorekeeper.id, UserRole.Storekeeper);
                    saveAuthUserToLocalStorage("user", user);
                    setUser(user);
                    return;
                }
                throw new Error();
            } catch (error) {
                setErrorUsername("authorizationForm.errorUsernameHeader2");
            }
        }
    }

    return <div className={styles.body}>

      <div className={styles.form}>

        <div>
            <label className={styles.label}>{t("authorizationForm.usernameHeader")}</label>
            <input className={styles.input} type="usernamr" placeholder={t("authorizationForm.usernamePlaceholder")} value={username} onChange={((e) => handleElementChange(e, setUsername))}/>
            {errorUsername && <span className={styles.error}>{t(errorUsername)}</span>}
        </div>
        <div>
            <label className={styles.label}>{t("authorizationForm.passwordHeader")}</label>
            <input className={styles.input} type="password" placeholder={t("authorizationForm.passwordPlaceholder")} value={password} onChange={((e) => handleElementChange(e, setPassword))}/>     
            {errorPassword && <span className={styles.error}>{t(errorPassword)}</span>}       
        </div>
        <div className={styles.radioButtons}>
            <label className={styles.label}>{t("authorizationForm.shepherdStatus")}</label>
            <label className={styles.radio}>
                <input className={styles.radioInput} type="radio" name="option" defaultChecked={true} value={UserRole.Shepherd} onChange={((e) => handleElementChange(e, setRole))}/>
                <span className={styles.checkmark}></span>
            </label>
            <label className={styles.label}>{t("authorizationForm.storekeeperStatus")}</label>
            <label className={styles.radio}>
                <input className={styles.radioInput} type="radio" name="option" value={UserRole.Storekeeper} onChange={((e) => handleElementChange(e, setRole))}/>
                <span className={styles.checkmark}></span>
            </label>
        </div>
        <div className={styles.actionButtonsContainer}>
            <button className={styles.actionButton} onClick={signIn}>{t("authorizationForm.signInButtonText")}</button>
        </div>
      </div>
    </div>
}

export default AuthorizationForm;