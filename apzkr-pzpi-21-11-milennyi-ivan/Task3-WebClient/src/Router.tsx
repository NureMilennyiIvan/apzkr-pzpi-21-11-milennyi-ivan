import { useEffect, useState } from 'react'
import { UserRole } from './utils/UserRole'
import { AuthUser } from './utils/AuthUser'
import { getAuthUserFromLocalStorage, saveAuthUserToLocalStorage } from './utils/helpers'
import { useTranslation } from 'react-i18next'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import styles from './assets/css/App.module.css'
import App from './App'
import { FeedPage } from './components/storekeeper/FeedPage'
import { SheepMainPage } from './components/shepherd/SheepMainPage'
import { CreateFeedSupplyForm } from './components/storekeeper/CreateFeedSupplyForm'
import { AdminBaseForm } from './components/admin/AdminBaseForm'
import { ReassignFormForSheep} from './components/admin/ReassignFormForSheep'

export const Router = () => {
  // Стан для зберігання авторизованого користувача
  const [user, setUser] = useState<AuthUser>(new AuthUser(null, UserRole.Unauthorized));

  // Функція для виходу з системи
  const logout = () => {
    const unauthorized_user = new AuthUser(null, UserRole.Unauthorized);
    saveAuthUserToLocalStorage("user", unauthorized_user);
    setUser(unauthorized_user);
  }

  // Використання useEffect для завантаження користувача з Local Storage при завантаженні компонента
  useEffect(() => {
    const result = getAuthUserFromLocalStorage("user");
    if (result.Id != null && user.Id == null) {
      setUser(new AuthUser(result.Id, result.Role));
    }
  }, [user])

  // Використання i18n для багатомовності
  const { t, i18n } = useTranslation();

  // Функція для зміни мови
  const changeLanguage = (lng?: string | undefined) => {
    i18n.changeLanguage(lng);
  };

  return (
    <div className={styles.container}>
      <BrowserRouter>
        <header className={styles.header}>
          <button className={styles.button} style={{ minWidth: "200px" }} onClick={() => changeLanguage(i18n.language === 'en' ? 'ua' : 'en')}>
            {t('router.switchButtonText')}
          </button>
          {user.Role != UserRole.Unauthorized && (
            <div className={styles.buttonContainer}>
              <button className={styles.button} onClick={logout}>{t('router.logoutButtonText')}</button>
            </div>
          )}
        </header>
        <div className={styles.content}>
          <Routes>
            <Route path="/" element={<App user={user} setUser={setUser} />} />
            <Route path="/sheep/:sheepId" element={<SheepMainPage user={user} setUser={setUser} />} />
            <Route path="/feed/:feedId" element={<FeedPage user={user} setUser={setUser} />} />
            <Route path="/create/feed-supply/:feedId" element={<CreateFeedSupplyForm user={user} setUser={setUser} />} />
            <Route path="/shepherd/create" element={<AdminBaseForm user={user} setUser={setUser} entityType="Shepherd" />} />
            <Route path="/shepherd/edit/:entityId" element={<AdminBaseForm user={user} setUser={setUser} entityType="Shepherd" />} />
            <Route path="/storekeeper/create" element={<AdminBaseForm user={user} setUser={setUser} entityType="Storekeeper" />} />
            <Route path="/storekeeper/edit/:entityId" element={<AdminBaseForm user={user} setUser={setUser} entityType="Storekeeper" />} />
            <Route path="/sheep/create" element={<AdminBaseForm user={user} setUser={setUser} entityType="Sheep" />} />
            <Route path="/sheep/edit/:entityId" element={<AdminBaseForm user={user} setUser={setUser} entityType="Sheep" />} />
            <Route path="/sheep/reassign-shepherd/:sheepId" element={<ReassignFormForSheep user={user} setUser={setUser} entityType="Shepherd" />} />
            <Route path="/sheep/reassign-temperature-scanner/:sheepId" element={<ReassignFormForSheep user={user} setUser={setUser} entityType="TemperatureScanner" />} />
            <Route path="/feed/create" element={<AdminBaseForm user={user} setUser={setUser} entityType="Feed" />} />
            <Route path="/feed/edit/:entityId" element={<AdminBaseForm user={user} setUser={setUser} entityType="Feed" />} />
            <Route path="/breed/create" element={<AdminBaseForm user={user} setUser={setUser} entityType="Breed" />} />
            <Route path="/breed/edit/:entityId" element={<AdminBaseForm user={user} setUser={setUser} entityType="Breed" />} />
            <Route path="/temperature-scanner/create" element={<AdminBaseForm user={user} setUser={setUser} entityType="TemperatureScanner" />} />
            <Route path="/temperature-scanner/edit/:entityId" element={<AdminBaseForm user={user} setUser={setUser} entityType="TemperatureScanner" />} />
            <Route path="*" element={<div>Not Found 404</div>} />
          </Routes>
        </div>
      </BrowserRouter>
      <footer className={styles.footer}>
        © 2024 Wool Farm Management System
      </footer>
    </div>
  )
};
