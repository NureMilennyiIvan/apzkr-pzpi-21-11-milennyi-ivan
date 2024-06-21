use std::sync::Arc;
use async_trait::async_trait;
use sqlx::{MySql, Pool, query, query_as};
use crate::db::service_error::ServiceError;
use crate::db::traits::{FeedSupplyManage, Service};
use crate::models::FeedSupply;
use crate::view_models::FeedSupplyVM;

// Сервіс для управління постачанням кормів
pub(crate) struct FeedSupplyService<T> {
    pool: Arc<T>,
}

#[async_trait]
impl Service<Pool<MySql>> for FeedSupplyService<Pool<MySql>> {
    type Model = FeedSupply;
    type Error = ServiceError;
    type ViewModel = FeedSupplyVM;

    // Функція для створення нового сервісу
    fn new(pool: Arc<Pool<MySql>>) -> Self {
        FeedSupplyService { pool }
    }

    // Функція для створення нового постачання корму
    async fn create(&self, mut item: Self::Model) -> Result<Self::Model, Self::Error> {
        let mut transaction = self.pool.begin().await.map_err(|error| ServiceError::DatabaseError(error))?;

        query(
            r#"
            UPDATE Feeds
            SET amount = amount + ?
            WHERE id = ?
            "#
        )
            .bind(item.amount())
            .bind(item.feed_id())
            .execute(&mut *transaction).await
            .map_err(|error| ServiceError::DatabaseError(error))?;

        let result = query(
            r#"
            INSERT INTO FeedSupplies (storekeeper_id, amount, timestamp, feed_id)
            VALUES (?, ?, ?, ?)
            "#
        )
            .bind(item.storekeeper_id())
            .bind(item.amount())
            .bind(item.timestamp())
            .bind(item.feed_id())
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

    // Функція для видалення постачання корму за його ідентифікатором
    async fn delete(&self, item_id: u64) -> Result<(), Self::Error> {
        query(
            r#"
            DELETE FROM FeedSupplies
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

    // Функція для оновлення інформації про постачання корму (заборонено)
    async fn update(&self, _item: Self::Model) -> Result<Self::Model, Self::Error> {
        Err(ServiceError::ForbiddenError)
    }

    // Функція для отримання всіх постачань кормів
    async fn get_all(&self) -> Result<Vec<Self::Model>, Self::Error> {
        query_as::<_, Self::Model>(
            r#"
            SELECT id, storekeeper_id, amount, timestamp, feed_id
            FROM FeedSupplies
            "#
        )
            .fetch_all(&*self.pool).await
            .map_err(|error| ServiceError::DatabaseError(error))
    }

    // Функція для отримання постачання корму за його ідентифікатором
    async fn get_by_id(&self, id: u64) -> Result<Option<Self::Model>, Self::Error> {
        query_as::<_, Self::Model>(
            r#"
            SELECT id, storekeeper_id, amount, timestamp, feed_id
            FROM FeedSupplies
            WHERE id = ?
            "#
        )
            .bind(id)
            .fetch_optional(&*self.pool).await
            .map_err(|error| ServiceError::DatabaseError(error))
    }
}

#[async_trait]
impl FeedSupplyManage<Pool<MySql>> for FeedSupplyService<Pool<MySql>> {
    // Функція для отримання всіх ViewModel постачань кормів
    async fn get_all_vms(&self) -> Result<Vec<Self::ViewModel>, Self::Error> {
        query_as::<_, FeedSupplyVM>(
            r#"
            SELECT
            fs.id,
            fs.amount,
            fs.timestamp,
            s.name AS storekeeper_name,
            s.surname AS storekeeper_surname
            FROM FeedSupplies fs
            LEFT JOIN Storekeepers s ON fs.storekeeper_id = s.id
            ORDER BY fs.timestamp DESC
            "#
        )
            .fetch_all(&*self.pool).await
            .map_err(|error| ServiceError::DatabaseError(error))
    }
    // Функція для отримання всіх ViewModel постачань кормів за ідентифікатором корму
    async fn get_all_vms_by_feed_id(&self, id: u64) -> Result<Vec<Self::ViewModel>, Self::Error> {
        query_as::<_, FeedSupplyVM>(
            r#"
            SELECT
            fs.id,
            fs.amount,
            fs.timestamp,
            s.name AS storekeeper_name,
            s.surname AS storekeeper_surname
            FROM FeedSupplies fs
            LEFT JOIN Storekeepers s ON fs.storekeeper_id = s.id
            WHERE fs.feed_id = ?
            ORDER BY fs.timestamp DESC
            "#
        )
            .bind(id)
            .fetch_all(&*self.pool).await
            .map_err(|error| ServiceError::DatabaseError(error))
    }
}
