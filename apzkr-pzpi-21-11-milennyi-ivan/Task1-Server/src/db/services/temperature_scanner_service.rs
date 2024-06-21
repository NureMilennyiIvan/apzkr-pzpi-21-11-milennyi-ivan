use std::sync::Arc;
use async_trait::async_trait;
use sqlx::{MySql, Pool, query, query_as, Row};
use crate::db::service_error::ServiceError;
use crate::db::traits::{Service, TemperatureScannerManage};
use crate::models::TemperatureScanner;
use crate::view_models::TemperatureScannerVM;

// Сервіс для управління сканерами температури
pub(crate) struct TemperatureScannerService<T>{
    pool: Arc<T>,
}

#[async_trait]
impl Service<Pool<MySql>> for TemperatureScannerService<Pool<MySql>> {
    type Model = TemperatureScanner;
    type Error = ServiceError;
    type ViewModel = TemperatureScannerVM;

    fn new(pool: Arc<Pool<MySql>>) -> Self {
        TemperatureScannerService { pool }
    }

    // Функція для створення нового сканера температури
    async fn create(&self, mut item: Self::Model) -> Result<Self::Model, Self::Error> {
        query(
            r#"
            INSERT INTO TemperatureScanners (temperature, password)
            VALUES (?, ?)
            "#
        )
            .bind(item.temperature())
            .bind(item.password())
            .execute(&*self.pool).await
            .map_err(|error| ServiceError::DatabaseError(error))
            .map(|result|
                if result.rows_affected() == 1 {
                    item.set_id(result.last_insert_id());
                    Ok(item)
                }
                else{
                    Err(ServiceError::CustomError("Insertion went wrong. Zero rows affected".to_string()))
                }
            )
            .unwrap_or_else(|error| Err(error))
    }

    // Функція для видалення сканера температури за його ідентифікатором
    async fn delete(&self, item_id: u64) -> Result<(), Self::Error> {
        query(
            r#"
            DELETE FROM TemperatureScanners
            WHERE id = ?
            "#
        )
            .bind(item_id)
            .execute(&*self.pool).await
            .map_err(|error| ServiceError::DatabaseError(error))
            .map(|result|
                if result.rows_affected() == 0 {
                    Err(ServiceError::CustomError("Zero rows affected".to_string()))
                }
                else{
                    Ok(())
                }
            )
            .unwrap_or_else(|error| Err(error))
    }

    // Функція для оновлення інформації про сканер температури
    async fn update(&self, item: Self::Model) -> Result<Self::Model, Self::Error> {
        query(
            r#"
            UPDATE TemperatureScanners
            SET temperature = ?, password = ?
            WHERE id = ?
            "#
        )
            .bind(item.temperature())
            .bind(item.password())
            .bind(item.id().ok_or(ServiceError::CustomError("ID is required".to_string()))?)
            .execute(&*self.pool).await
            .map_err(|error| ServiceError::DatabaseError(error))
            .map(|result|
                if result.rows_affected() == 0 {
                    Err(ServiceError::CustomError("Zero rows affected".to_string()))
                }
                else{
                    Ok(item)
                }
            )
            .unwrap_or_else(|error|  Err(error))
    }

    // Функція для отримання всіх сканерів температури
    async fn get_all(&self) -> Result<Vec<Self::Model>, Self::Error> {
        query_as::<_, Self::Model>(
            r#"
            SELECT * FROM TemperatureScanners
            "#
        )
            .fetch_all(&*self.pool).await
            .map_err(|error| ServiceError::DatabaseError(error))
    }

    // Функція для отримання сканера температури за його ідентифікатором
    async fn get_by_id(&self, id: u64) -> Result<Option<Self::Model>, Self::Error> {
        query_as::<_, Self::Model>(
            r#"
            SELECT * FROM TemperatureScanners
            WHERE id = ?
            "#
        )
            .bind(id)
            .fetch_optional(&*self.pool).await
            .map_err(|error| ServiceError::DatabaseError(error))
    }
}

#[async_trait]
impl TemperatureScannerManage<Pool<MySql>> for TemperatureScannerService<Pool<MySql>> {
    async fn get_all_unassigned_scanners_ids(&self) -> Result<Vec<u64>, Self::Error> {
        query(
            r#"
            SELECT ts.id
            FROM TemperatureScanners ts
            WHERE (SELECT COUNT(*) FROM Sheep WHERE temperature_scanner_id = ts.id) = 0
            "#
        )
        .fetch_all(&*self.pool).await
            .map(|rows| {
                rows.into_iter().map(|row| row.get::<u64, _>("id")).collect::<Vec<u64>>()
            }).map_err(|error| ServiceError::DatabaseError(error))
    }

    // Функція для аутентифікації сканера температури за ідентифікатором та хешем пароля
    async fn authenticate(&self, id: u64, hash_password: String) -> Result<bool, Self::Error> {
        query_as::<_, Self::Model>(
            r#"
            SELECT *
            FROM TemperatureScanners ts
            WHERE ts.id = ? AND ts.password = ? AND (SELECT COUNT(*) FROM Sheep WHERE temperature_scanner_id = ts.id) = 1
            "#
        )
            .bind(id)
            .bind(hash_password)
            .fetch_optional(&*self.pool).await
            .map(|result| result.is_some()).map_err(|error| ServiceError::DatabaseError(error))
    }

    // Функція для оновлення температури сканера за ідентифікатором
    async fn update_temperature(&self, id: u64, temperature: u64) -> Result<(), Self::Error> {
        query(
            r#"
            UPDATE TemperatureScanners
            SET temperature = ?
            WHERE id = ? AND (SELECT COUNT(*) FROM Sheep WHERE temperature_scanner_id = ?) = 1
            "#
        )
            .bind(temperature)
            .bind(id)
            .bind(id)
            .execute(&*self.pool).await
            .map_err(|error| ServiceError::DatabaseError(error))
            .map(|result|
                if result.rows_affected() == 0 {
                    Err(ServiceError::CustomError("Zero rows affected".to_string()))
                }
                else{
                    Ok(())
                }
            )
            .unwrap_or_else(|error| Err(error))
    }
}
