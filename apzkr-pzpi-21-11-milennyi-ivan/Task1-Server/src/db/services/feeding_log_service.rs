use std::sync::Arc;
use async_trait::async_trait;
use sqlx::{MySql, Pool, query, query_as};
use crate::db::service_error::ServiceError;
use crate::db::traits::{FeedingLogManage, Service};
use crate::models::FeedingLog;
use crate::view_models::FeedingLogVM;

// Сервіс для управління логами годування
pub(crate) struct FeedingLogService<T> {
    pool: Arc<T>,
}

#[async_trait]
impl Service<Pool<MySql>> for FeedingLogService<Pool<MySql>> {
    type Model = FeedingLog;
    type Error = ServiceError;
    type ViewModel = FeedingLogVM;

    fn new(pool: Arc<Pool<MySql>>) -> Self {
        FeedingLogService { pool }
    }

    // Функція для створення нового логу годування
    async fn create(&self, mut item: Self::Model) -> Result<Self::Model, Self::Error> {
        let mut transaction = self.pool.begin().await.map_err(|error| ServiceError::DatabaseError(error))?;

        query(
            r#"
            UPDATE Feeds
            SET amount = amount - ?
            WHERE id = ?
            "#
        )
            .bind(item.amount())
            .bind(item.feed_id())
            .execute(&mut *transaction).await
            .map_err(|error| ServiceError::DatabaseError(error))?;

        let result = query(
            r#"
            INSERT INTO FeedingLogs (sheep_id, shepherd_id, timestamp, feed_id, amount)
            VALUES (?, ?, ?, ?, ?)
            "#
        )
            .bind(item.sheep_id())
            .bind(item.shepherd_id().ok_or(ServiceError::CustomError("ID is required".to_string()))?)
            .bind(item.timestamp())
            .bind(item.feed_id())
            .bind(item.amount())
            .execute(&mut *transaction).await
            .map_err(|error| ServiceError::DatabaseError(error))
            .map(|result|
                if result.rows_affected() == 1 {
                    item.set_id(result.last_insert_id());
                    Ok(item)
                } else {
                    Err(ServiceError::CustomError("Insertion went wrong. Zero rows affected".to_string()))
                }
            )
            .unwrap_or_else(|error| Err(error));

        transaction.commit().await.map_err(|error| ServiceError::DatabaseError(error))?;

        result
    }

    // Функція для видалення логу годування за його ідентифікатором
    async fn delete(&self, item_id: u64) -> Result<(), Self::Error> {
        query(
            r#"
            DELETE FROM FeedingLogs
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

    // Функція для отримання всіх логів годування
    async fn get_all(&self) -> Result<Vec<Self::Model>, Self::Error> {
        query_as::<_, Self::Model>(
            r#"
            SELECT * FROM FeedingLogs
            "#
        )
            .fetch_all(&*self.pool).await
            .map_err(|error| ServiceError::DatabaseError(error))
    }

    // Функція для отримання логу годування за його ідентифікатором
    async fn get_by_id(&self, id: u64) -> Result<Option<Self::Model>, Self::Error> {
        query_as::<_, Self::Model>(
            r#"
            SELECT * FROM FeedingLogs
            WHERE id = ?
            "#
        )
            .bind(id)
            .fetch_optional(&*self.pool).await
            .map_err(|error| ServiceError::DatabaseError(error))
    }
}

#[async_trait]
impl FeedingLogManage<Pool<MySql>> for FeedingLogService<Pool<MySql>> {
    // Функція для отримання всіх ViewModel логів годування за ідентифікатором вівці
    async fn get_all_vms_by_sheep_id(&self, id: u64) -> Result<Vec<Self::ViewModel>, Self::Error> {
        query_as::<_, FeedingLogVM>(
            r#"
            SELECT
            fl.id,
            fl.timestamp,
            fl.amount,
            sh.name AS shepherd_name,
            sh.surname AS shepherd_surname,
            fl.sheep_id
            FROM FeedingLogs fl
            LEFT JOIN Shepherds sh ON fl.shepherd_id = sh.id
            WHERE fl.sheep_id = ?
            ORDER BY fl.timestamp DESC
            "#
        )
            .bind(id)
            .fetch_all(&*self.pool).await
            .map_err(|error| ServiceError::DatabaseError(error))
    }

    // Функція для отримання всіх ViewModel логів годування за ідентифікатором корму
    async fn get_all_vms_by_feed_id(&self, id: u64) -> Result<Vec<Self::ViewModel>, Self::Error> {
        query_as::<_, FeedingLogVM>(
            r#"
            SELECT
            fl.id,
            fl.timestamp,
            fl.amount,
            sh.name AS shepherd_name,
            sh.surname AS shepherd_surname,
            fl.sheep_id
            FROM FeedingLogs fl
            LEFT JOIN Shepherds sh ON fl.shepherd_id = sh.id
            WHERE fl.feed_id = ?
            ORDER BY fl.timestamp DESC
            "#
        )
            .bind(id)
            .fetch_all(&*self.pool).await
            .map_err(|error| ServiceError::DatabaseError(error))
    }
}
