import { NavigateFunction } from "react-router-dom";
import { AuthUser } from "./AuthUser";
import { UserRole } from "./UserRole";
import { useEffect } from "react";

// Функція для конвертації мітки часу в дату у форматі "гг:хх дд.мм.рррр"
export const timestampToDate = (timestamp: number): string => {
  let date = new Date(timestamp * 1000);
  let hours = date.getHours().toString().padStart(2, '0');
  let minutes = date.getMinutes().toString().padStart(2, '0');
  let day = date.getDate();
  let month = (date.getMonth() + 1).toString().padStart(2, '0');
  let year = date.getFullYear();
  return `${hours}:${minutes} ${day}.${month}.${year}`;
}

// Функція для збереження авторизованого користувача в Local Storage
export const saveAuthUserToLocalStorage = (key: string, value: AuthUser) => {
  try {
      const serializedValue = JSON.stringify({
          Id: value.Id,
          Role: value.Role
      });
      localStorage.setItem(key, serializedValue);
  } catch (error) {
      console.error('Error saving to Local Storage:', error);
  }
};

// Функція для отримання авторизованого користувача з Local Storage
export const getAuthUserFromLocalStorage = (key: string): AuthUser => {
  try {
      const serializedValue = JSON.parse(localStorage.getItem(key) as string);
      if (serializedValue != null) {
          //@ts-ignore
          return new AuthUser(serializedValue.Id, serializedValue.Role);
      }
      return new AuthUser(null, UserRole.Unauthorized);
  } catch (error) {
      console.error('Error retrieving from Local Storage:', error);
      return new AuthUser(null, UserRole.Unauthorized);
  }
};

// Функція для хешування пароля
export const hashPassword = async (password: string) => {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);

  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashedPassword = hashArray.map((byte) => ('00' + byte.toString(16)).slice(-2)).join('');

  return hashedPassword;
};

// Функція для перевірки користувача та навігації
export const useEffectUser = (dependency: AuthUser, navigate: NavigateFunction) => {
  useEffect(() => {
      const result = getAuthUserFromLocalStorage("user");
      if (result.Id == null) {
          navigate("/");
      }
  }, [dependency])
};

// Функція для обробки зміни елементів
export const handleElementChange = (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLSelectElement> | React.ChangeEvent<HTMLTextAreaElement>, setChanges: (value: React.SetStateAction<any>) => void) => {
  setChanges(e.target.value);
};

// Функція для обчислення часу в днях з мітки часу
export const timeInDays = (timestamp: number | null): number => {
  if (timestamp == null) {
      return Infinity;
  }
  const difference = (new Date().getTime() - timestamp * 1000);
  const days = difference / 1000 / 3600 / 24;
  return Math.floor(days);
}
