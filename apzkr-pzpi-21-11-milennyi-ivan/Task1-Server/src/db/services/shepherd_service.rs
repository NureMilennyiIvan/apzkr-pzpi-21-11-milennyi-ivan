use std::sync::Arc;
use async_trait::async_trait;
use sqlx::{MySql, Pool, query, query_as};
use crate::db::service_error::ServiceError;
use crate::db::traits::{AuthService, Service, ShepherdManage};
use crate::models::Shepherd;
use crate::view_models::ShepherdVM;

// Сервіс для управління пастухами
pub(crate) struct ShepherdService<T>{
    pool: Arc<T>,
}

#[async_trait]
impl Service<Pool<MySql>> for ShepherdService<Pool<MySql>> {
    type Model = Shepherd;
    type Error = ServiceError;
    type ViewModel = ShepherdVM;

    fn new(pool: Arc<Pool<MySql>>) -> Self {
        ShepherdService { pool }
    }

    // Функція для створення нового пастуха
    async fn create(&self, mut item: Self::Model) -> Result<Self::Model, Self::Error> {
        query(
            r#"
            INSERT INTO Shepherds (username, password, name, surname)
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

    // Функція для видалення пастуха за його ідентифікатором
    async fn delete(&self, item_id: u64) -> Result<(), Self::Error> {
        query(
            r#"
            DELETE FROM Shepherds
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

    // Функція для оновлення інформації про пастуха
    async fn update(&self, item: Self::Model) -> Result<Self::Model, Self::Error> {
        query(
            r#"
            UPDATE Shepherds
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

    // Функція для отримання всіх пастухів
    async fn get_all(&self) -> Result<Vec<Self::Model>, Self::Error> {
        query_as::<_, Self::Model>(
            r#"
            SELECT * FROM Shepherds
            "#
        )
            .fetch_all(&*self.pool).await
            .map_err(|error| ServiceError::DatabaseError(error))
    }

    // Функція для отримання пастуха за його ідентифікатором
    async fn get_by_id(&self, id: u64) -> Result<Option<Self::Model>, Self::Error> {
        query_as::<_, Self::Model>(
            r#"
            SELECT * FROM Shepherds
            WHERE id = ?
            "#
        )
            .bind(id)
            .fetch_optional(&*self.pool).await
            .map_err(|error| ServiceError::DatabaseError(error))
    }
}

#[async_trait]
impl AuthService<Pool<MySql>> for ShepherdService<Pool<MySql>> {
    // Функція для перевірки унікальності імені користувача
    async fn check_username(&self, user: &Self::Model) -> Result<bool, Self::Error> {
        query_as::<_, Self::Model>(
            r#"
            SELECT * FROM Shepherds
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
            SELECT id, name, surname FROM Shepherds
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
impl ShepherdManage<Pool<MySql>> for ShepherdService<Pool<MySql>>{

    // Функція для отримання всіх ViewModel пастухів
    async fn get_all_vms(&self) -> Result<Vec<Self::ViewModel>, Self::Error> {
        query_as::<_, ShepherdVM>(
            r#"
            SELECT
            s.id,
            s.name,
            s.surname
            FROM Shepherds s
            "#
        )
            .fetch_all(&*self.pool).await
            .map_err(|error| ServiceError::DatabaseError(error))
    }
}
