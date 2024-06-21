import ReactDOM from 'react-dom/client'
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next'
import translationEN from './locales/en.json';
import translationUA from './locales/ua.json';
import { Router } from './Router';

const resources = {
  en: {
    translation: translationEN,
  },
  ua: {
    translation: translationUA,
  },
};

// Ініціалізація i18next з налаштуваннями
i18n
  .use(initReactI18next) // Використання React i18next
  .init({
    resources, // Ресурси для перекладів
    lng: 'ua', // Мова за замовчуванням
    fallbackLng: 'ua', // Резервна мова
    interpolation: {
      escapeValue: false, // Вимкнення escaping для безпеки
    },
  });

// Рендеринг кореневого компонента React у DOM
ReactDOM.createRoot(document.getElementById('root')!).render(
  <Router />
);