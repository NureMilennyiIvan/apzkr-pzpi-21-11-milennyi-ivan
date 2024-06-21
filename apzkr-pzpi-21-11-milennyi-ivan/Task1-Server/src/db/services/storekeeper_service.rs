use std::sync::Arc;
use async_trait::async_trait;
use sqlx::{MySql, Pool, query, query_as};
use crate::db::service_error::ServiceError;
use crate::db::traits::{AuthService, Service, StorekeeperManage};
use crate::models::Storekeeper;
use crate::view_models::StorekeeperVM;

// Сервіс для управління комірниками
pub(crate) struct StorekeeperService<T>{
    pool: Arc<T>,
}

#[async_trait]
impl Service<Pool<MySql>> for StorekeeperService<Pool<MySql>> {
    type Model = Storekeeper;
    type Error = ServiceError;
    type ViewModel = StorekeeperVM;

    fn new(pool: Arc<Pool<MySql>>) -> Self {
        StorekeeperService { pool }
    }

    // Функція для створення нового комірника
    async fn create(&self, mut item: Self::Model) -> Result<Self::Model, Self::Error> {
        query(
            r#"
            INSERT INTO Storekeepers (username, password, name, surname)
            VALUES (?, ?, ?, ?)
            "#
        )
            .bind(item.username())
            .bind(item.password())
            .bind(item.name())
            .bind(item.surname())
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

    // Функція для видалення комірника за його ідентифікатором
    async fn delete(&self, item_id: u64) -> Result<(), Self::Error> {
        query(
            r#"
            DELETE FROM Storekeepers
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

    // Функція для оновлення інформації про комірника
    async fn update(&self, item: Self::Model) -> Result<Self::Model, Self::Error> {
        query(
            r#"
            UPDATE Storekeepers
            SET username = ?, password = ?, name = ?, surname = ?
            WHERE id = ?
            "#
        )
            .bind(item.username())
            .bind(item.password())
            .bind(item.name())
            .bind(item.surname())
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

    // Функція для отримання всіх комірників
    async fn get_all(&self) -> Result<Vec<Self::Model>, Self::Error> {
        query_as::<_, Self::Model>(
            r#"
            SELECT * FROM Storekeepers
            "#
        )
            .fetch_all(&*self.pool).await
            .map_err(|error| ServiceError::DatabaseError(error))
    }

    // Функція для отримання комірника за його ідентифікатором
    async fn get_by_id(&self, id: u64) -> Result<Option<Self::Model>, Self::Error> {
        query_as::<_, Self::Model>(
            r#"
            SELECT * FROM Storekeepers
            WHERE id = ?
            "#
        )
            .bind(id)
            .fetch_optional(&*self.pool).await
            .map_err(|error| ServiceError::DatabaseError(error))
    }
}

#[async_trait]
impl AuthService<Pool<MySql>> for StorekeeperService<Pool<MySql>> {
    // Функція для перевірки унікальності імені користувача
    async fn check_username(&self, user: &Self::Model) -> Result<bool, Self::Error> {
        query_as::<_, Self::Model>(
            r#"
            SELECT * FROM Storekeepers
            WHERE username = ?
            "#
        )
            .bind(user.username())
            .fetch_optional(&*self.pool).await
            .map(|result| result.is_some()).map_err(|error| ServiceError::DatabaseError(error))
    }

    // Функція для авторизації користувача
    async fn authorize(&self, username: String, password_hash: String) -> Result<Option<Self::ViewModel>, Self::Error> {
        query_as::<_, Self::ViewModel>(
            r#"
            SELECT id, name, surname FROM Storekeepers
            WHERE username = ? AND password = ?
            "#
        )
            .bind(username)
            .bind(password_hash)
            .fetch_optional(&*self.pool).await
            .map_err(|error| ServiceError::DatabaseError(error))
    }
}

#[async_trait]
impl StorekeeperManage<Pool<MySql>> for StorekeeperService<Pool<MySql>>{

}
