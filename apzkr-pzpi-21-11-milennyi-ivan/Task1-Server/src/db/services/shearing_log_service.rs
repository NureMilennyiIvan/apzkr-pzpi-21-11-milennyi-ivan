use std::sync::Arc;
use async_trait::async_trait;
use sqlx::{MySql, Pool, query, query_as};
use crate::db::service_error::ServiceError;
use crate::db::traits::{Service, ShearingLogManage};
use crate::models::ShearingLog;
use crate::view_models::ShearingLogVM;

// Сервіс для управління логами стрижки
pub(crate) struct ShearingLogService<T> {
    pool: Arc<T>,
}

#[async_trait]
impl Service<Pool<MySql>> for ShearingLogService<Pool<MySql>> {
    type Model = ShearingLog;
    type Error = ServiceError;
    type ViewModel = ShearingLogVM;

    fn new(pool: Arc<Pool<MySql>>) -> Self {
        ShearingLogService { pool }
    }

    // Функція для створення нового логу стрижки
    async fn create(&self, mut item: Self::Model) -> Result<Self::Model, Self::Error> {
        query(
            r#"
            INSERT INTO ShearingLogs (sheep_id, shepherd_id, timestamp, wool_amount)
            VALUES (?, ?, ?, ?)
            "#
        )
            .bind(item.sheep_id())
            .bind(item.shepherd_id().ok_or(ServiceError::CustomError("ID is required".to_string()))?)
            .bind(item.timestamp())
            .bind(item.wool_amount())
            .execute(&*self.pool).await
            .map_err(|error| ServiceError::DatabaseError(error))
            .map(|result|
                if result.rows_affected() == 1 {
                    item.set_id(result.last_insert_id());
                    Ok(item)
                } else {
                    Err(ServiceError::CustomError("Insertion went wrong. Zero rows affected".to_string()))
                }
            )
            .unwrap_or_else(|error| Err(error))
    }

    // Функція для видалення логу стрижки за його ідентифікатором
    async fn delete(&self, item_id: u64) -> Result<(), Self::Error> {
        query(
            r#"
            DELETE FROM ShearingLogs
            WHERE id = ?
            "#
        )
            .bind(item_id)
            .execute(&*self.pool).await
            .map_err(|error| ServiceError::DatabaseError(error))
            .map(|result|
                if result.rows_affected() == 0 {
                    Err(ServiceError::CustomError("Zero rows affected".to_string()))
                } else {
                    Ok(())
                }
            )
            .unwrap_or_else(|error| Err(error))
    }

    async fn update(&self, _item: Self::Model) -> Result<Self::Model, Self::Error> {
        Err(ServiceError::ForbiddenError)
    }

    // Функція для отримання всіх логів стрижки
    async fn get_all(&self) -> Result<Vec<Self::Model>, Self::Error> {
        query_as::<_, Self::Model>(
            r#"
            SELECT * FROM ShearingLogs
            "#
        )
            .fetch_all(&*self.pool).await
            .map_err(|error| ServiceError::DatabaseError(error))
    }

    // Функція для отримання логу стрижки за його ідентифікатором
    async fn get_by_id(&self, id: u64) -> Result<Option<Self::Model>, Self::Error> {
        query_as::<_, Self::Model>(
            r#"
            SELECT * FROM ShearingLogs
            WHERE id = ?
            "#
        )
            .bind(id)
            .fetch_optional(&*self.pool).await
            .map_err(|error| ServiceError::DatabaseError(error))
    }
}

#[async_trait]
impl ShearingLogManage<Pool<MySql>> for ShearingLogService<Pool<MySql>> {
    // Функція для отримання всіх ViewModel логів стрижки за ідентифікатором вівці
    async fn get_all_vms_by_sheep_id(&self, id: u64) -> Result<Vec<Self::ViewModel>, Self::Error> {
        query_as::<_, ShearingLogVM>(
            r#"
            SELECT
            sl.id,
            sl.timestamp,
            sl.wool_amount,
            sh.name AS shepherd_name,
            sh.surname AS shepherd_surname,
            sl.sheep_id
            FROM ShearingLogs sl
            LEFT JOIN Shepherds sh ON sl.shepherd_id = sh.id
            WHERE sl.sheep_id = ?
            ORDER BY sl.timestamp DESC
            "#
        )
            .bind(id)
            .fetch_all(&*self.pool).await
            .map_err(|error| ServiceError::DatabaseError(error))
    }
}
