use std::sync::Arc;
use async_trait::async_trait;
use sqlx::{MySql, Pool, query_as, query};
use crate::db::service_error::ServiceError;
use crate::db::traits::{BreedManage, Service};
use crate::models::Breed;
use crate::view_models::BreedVM;

// Сервіс для управління породами овець
pub(crate) struct BreedService<T> {
    pool: Arc<T>,
}

#[async_trait]
impl Service<Pool<MySql>> for BreedService<Pool<MySql>> {
    type Model = Breed;
    type Error = ServiceError;
    type ViewModel = BreedVM;

    // Функція для створення нового сервісу
    fn new(pool: Arc<Pool<MySql>>) -> Self {
        BreedService { pool }
    }

    // Функція для створення нової породи
    async fn create(&self, mut item: Self::Model) -> Result<Self::Model, Self::Error> {
        query(
            r#"
            INSERT INTO Breeds (name, feed_id, info)
            VALUES (?, ?, ?)
            "#
        )
            .bind(item.name())
            .bind(item.feed_id())
            .bind(item.info())
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

    // Функція для видалення породи за її ідентифікатором
    async fn delete(&self, item_id: u64) -> Result<(), Self::Error> {
        query(
            r#"
            DELETE FROM Breeds
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

    // Функція для оновлення інформації про породу
    async fn update(&self, item: Self::Model) -> Result<Self::Model, Self::Error> {
        query(
            r#"
            UPDATE Breeds
            SET name = ?, feed_id = ?, info = ?
            WHERE id = ?
            "#
        )
            .bind(item.name())
            .bind(item.feed_id())
            .bind(item.info())
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

    // Функція для отримання всіх порід
    async fn get_all(&self) -> Result<Vec<Self::Model>, Self::Error> {
        query_as::<_, Self::Model>(
            r#"
            SELECT * FROM Breeds
            "#
        )
            .fetch_all(&*self.pool).await
            .map_err(|error| ServiceError::DatabaseError(error))
    }

    // Функція для отримання породи за її ідентифікатором
    async fn get_by_id(&self, id: u64) -> Result<Option<Self::Model>, Self::Error> {
        query_as::<_, Self::Model>(
            r#"
            SELECT * FROM Breeds
            WHERE id = ?
            "#
        )
            .bind(id)
            .fetch_optional(&*self.pool).await
            .map_err(|error| ServiceError::DatabaseError(error))
    }
}

#[async_trait]
impl BreedManage<Pool<MySql>> for BreedService<Pool<MySql>> {
    // Функція для отримання всіх ViewModel порід
    async fn get_all_vms(&self) -> Result<Vec<Self::ViewModel>, Self::Error> {
        query_as::<_, BreedVM>(
            r#"
            SELECT
            b.id,
            b.name,
            b.info,
            f.name AS feed_name,
            CAST((SELECT COUNT(*) FROM Sheep s WHERE s.breed_id = b.id) AS UNSIGNED) AS sheep_count
            FROM Breeds b
            INNER JOIN Feeds f ON b.feed_id = f.id
            "#
        )
            .fetch_all(&*self.pool).await
            .map_err(|error| ServiceError::DatabaseError(error))
    }
}
