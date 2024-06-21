use std::sync::Arc;
use async_trait::async_trait;
use sqlx::{MySql, Pool, query, query_as};
use crate::db::service_error::ServiceError;
use crate::db::traits::{FeedManage, Service};
use crate::models::Feed;
use crate::view_models::FeedVM;

// Сервіс для управління кормами
pub(crate) struct FeedService<T> {
    pool: Arc<T>,
}

#[async_trait]
impl Service<Pool<MySql>> for FeedService<Pool<MySql>> {
    type Model = Feed;
    type Error = ServiceError;
    type ViewModel = FeedVM;

    // Функція для створення нового сервісу
    fn new(pool: Arc<Pool<MySql>>) -> Self {
        FeedService { pool }
    }

    // Функція для створення нового корму
    async fn create(&self, mut item: Self::Model) -> Result<Self::Model, Self::Error> {
        query(
            r#"
            INSERT INTO Feeds (amount, name, calories, fat, protein, carbohydrates)
            VALUES (?, ?, ?, ?, ?, ?)
            "#
        )
            .bind(item.amount())
            .bind(item.name())
            .bind(item.calories())
            .bind(item.fat())
            .bind(item.protein())
            .bind(item.carbohydrates())
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

    // Функція для видалення корму за його ідентифікатором
    async fn delete(&self, item_id: u64) -> Result<(), Self::Error> {
        query(
            r#"
            DELETE FROM Feeds
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

    // Функція для оновлення інформації про корм
    async fn update(&self, item: Self::Model) -> Result<Self::Model, Self::Error> {
        query(
            r#"
            UPDATE Feeds
            SET amount = ?, name = ?, calories = ?, fat = ?, protein = ?, carbohydrates = ?
            WHERE id = ?
            "#
        )
            .bind(item.amount())
            .bind(item.name())
            .bind(item.calories())
            .bind(item.fat())
            .bind(item.protein())
            .bind(item.carbohydrates())
            .bind(item.id().ok_or(ServiceError::CustomError("ID is required".to_string()))?)
            .execute(&*self.pool).await
            .map_err(|error| ServiceError::DatabaseError(error))
            .map(|result|
                if result.rows_affected() == 0 {
                    Err(ServiceError::CustomError("Zero rows affected".to_string()))
                } else {
                    Ok(item)
                }
            )
            .unwrap_or_else(|error| Err(error))
    }

    // Функція для отримання всіх кормів
    async fn get_all(&self) -> Result<Vec<Self::Model>, Self::Error> {
        query_as::<_, Self::Model>(
            r#"
            SELECT * FROM Feeds
            "#
        )
            .fetch_all(&*self.pool).await
            .map_err(|error| ServiceError::DatabaseError(error))
    }

    // Функція для отримання корму за його ідентифікатором
    async fn get_by_id(&self, id: u64) -> Result<Option<Self::Model>, Self::Error> {
        query_as::<_, Self::Model>(
            r#"
            SELECT * FROM Feeds
            WHERE id = ?
            "#
        )
            .bind(id)
            .fetch_optional(&*self.pool).await
            .map_err(|error| ServiceError::DatabaseError(error))
    }
}

#[async_trait]
impl FeedManage<Pool<MySql>> for FeedService<Pool<MySql>> {
    // Функція для отримання всіх ViewModel кормів
    async fn get_all_vms(&self) -> Result<Vec<Self::ViewModel>, Self::Error> {
        query_as::<_, FeedVM>(
            r#"
            SELECT
            f.id,
            f.amount,
            f.name,
            f.calories,
            f.fat,
            f.protein,
            f.carbohydrates,
            b.name AS breed_name,
            CAST((SELECT COUNT(*) FROM Sheep s WHERE s.breed_id = b.id) AS UNSIGNED) AS sheep_count
            FROM Feeds f
            LEFT JOIN Breeds b ON f.id = b.feed_id
            "#
        )
            .fetch_all(&*self.pool).await
            .map_err(|error| ServiceError::DatabaseError(error))
    }
}
