use std::sync::Arc;
use async_trait::async_trait;
use sqlx::{MySql, Pool, query, query_as};
use crate::db::service_error::ServiceError;
use crate::db::traits::{Service, SheepManage};
use crate::models::Sheep;
use crate::view_models::{extra_view_models::SheepDetailsVM, SheepVM};

// Сервіс для управління вівцями
pub(crate) struct SheepService<T>{
    pool: Arc<T>,
}

#[async_trait]
impl Service<Pool<MySql>> for SheepService<Pool<MySql>> {
    type Model = Sheep;
    type Error = ServiceError;
    type ViewModel = SheepVM;

    fn new(pool: Arc<Pool<MySql>>) -> Self {
        SheepService { pool }
    }

    // Функція для створення нової вівці
    async fn create(&self, mut item: Self::Model) -> Result<Self::Model, Self::Error> {
        query(
            r#"
            INSERT INTO Sheep (birth_date, breed_id, weight, sex, temperature_scanner_id, shepherd_id)
            VALUES (?, ?, ?, ?, null, ?)
            "#
        )
            .bind(item.birth_date())
            .bind(item.breed_id())
            .bind(item.weight())
            .bind(item.sex())
            .bind(item.shepherd_id())
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

    // Функція для видалення вівці за її ідентифікатором
    async fn delete(&self, item_id: u64) -> Result<(), Self::Error> {
        query(
            r#"
            DELETE FROM Sheep
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

    // Функція для оновлення інформації про вівцю
    async fn update(&self, item: Self::Model) -> Result<Self::Model, Self::Error> {
        query(
            r#"
            UPDATE Sheep
            SET birth_date = ?, breed_id = ?, weight = ?, sex = ?, temperature_scanner_id = ?, shepherd_id = ?
            WHERE id = ?
            "#
        )
            .bind(item.birth_date())
            .bind(item.breed_id())
            .bind(item.weight())
            .bind(item.sex())
            .bind(item.temperature_scanner_id())
            .bind(item.shepherd_id())
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

    // Функція для отримання всіх овець
    async fn get_all(&self) -> Result<Vec<Self::Model>, Self::Error> {
        query_as::<_, Self::Model>(
            r#"
            SELECT * FROM Sheep
            "#
        )
            .fetch_all(&*self.pool).await
            .map_err(|error| ServiceError::DatabaseError(error))
    }

    // Функція для отримання вівці за її ідентифікатором
    async fn get_by_id(&self, id: u64) -> Result<Option<Self::Model>, Self::Error> {
        query_as::<_, Self::Model>(
            r#"
            SELECT * FROM Sheep
            WHERE id = ?
            "#
        )
            .bind(id)
            .fetch_optional(&*self.pool).await
            .map_err(|error| ServiceError::DatabaseError(error))
    }
}

#[async_trait]
impl SheepManage<Pool<MySql>> for SheepService<Pool<MySql>>{
    type SheepDetails = SheepDetailsVM;

    // Функція для отримання всіх ViewModel овець за ідентифікатором пастуха
    async fn get_all_vms_by_shepherd_id(&self, id: u64) -> Result<Vec<Self::ViewModel>, Self::Error> {
        query_as::<_, SheepVM>(
            r#"
            SELECT
            s.id,
            b.name AS breed,
            s.sex,
            s.birth_date,
            (
                SELECT MAX(fl.timestamp)
                FROM FeedingLogs fl
                WHERE fl.sheep_id = s.id
            ) AS last_feeding_timestamp,
            (
                SELECT MAX(sl.timestamp)
                FROM ShearingLogs sl
                WHERE sl.sheep_id = s.id
            ) AS last_shearing_timestamp
            FROM Sheep s
            LEFT JOIN Breeds b ON s.breed_id = b.id
            WHERE s.shepherd_id = ?
            "#
        )
            .bind(id)
            .fetch_all(&*self.pool).await
            .map_err(|error| ServiceError::DatabaseError(error))
    }

    // Функція для отримання детальної інформації про вівцю за її ідентифікатором
    async fn get_details_by_id(&self, id: u64) -> Result<Option<Self::SheepDetails>, Self::Error> {
        query_as::<_, SheepDetailsVM>(
            r#"
            SELECT
            s.id,
            b.name AS breed,
            b.info AS breed_info,
            s.sex,
            s.birth_date,
            (
                SELECT MAX(fl.timestamp)
                FROM FeedingLogs fl
                WHERE fl.sheep_id = s.id
            ) AS last_feeding_timestamp,
            (
                SELECT MAX(sl.timestamp)
                FROM ShearingLogs sl
                WHERE sl.sheep_id = s.id
            ) AS last_shearing_timestamp,
            s.weight,
            ts.temperature,
            f.id AS feed_id,
            f.name AS feed_name,
            CAST(ROUND(
                CASE
                    WHEN s.sex = true THEN s.weight * (0.05 + 0.0001 * TIMESTAMPDIFF(DAY, FROM_UNIXTIME(s.birth_date), NOW()))
                    ELSE s.weight * (0.04 + 0.0001 * TIMESTAMPDIFF(DAY, FROM_UNIXTIME(s.birth_date), NOW()))
                END
            ) AS UNSIGNED) AS required_feed_amount,
            f.amount AS available_feed_amount
            FROM Sheep s
            INNER JOIN Breeds b ON s.breed_id = b.id
            LEFT JOIN TemperatureScanners ts ON s.temperature_scanner_id = ts.id
            INNER JOIN Feeds f ON b.feed_id = f.id
            WHERE s.id = ?
            "#
        )
            .bind(id)
            .fetch_optional(&*self.pool).await
            .map_err(|error| ServiceError::DatabaseError(error))
    }

    // Функція для зміни пастуха для вівці
    async fn change_shepherd(&self, sheep_id: u64, shepherd_id: Option<u64>) -> Result<(), Self::Error> {
        query(
            r#"
            UPDATE Sheep
            SET shepherd_id = ?
            WHERE id = ?
            "#
        )
            .bind(shepherd_id)
            .bind(sheep_id)
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

    // Функція для зміни сканера температури для вівці
    async fn change_temperature_scanner(&self, sheep_id: u64, temperature_scanner_id: Option<u64>) -> Result<(), Self::Error> {
        query(
            r#"
            UPDATE Sheep
            SET temperature_scanner_id = ?
            WHERE id = ?
            "#
        )
            .bind(temperature_scanner_id)
            .bind(sheep_id)
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
