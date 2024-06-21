use std::sync::Arc;
use async_trait::async_trait;
use sqlx::{MySql, MySqlPool, Pool};
use crate::db::traits::Context;

// Структура для збереження контексту бази даних
pub(crate) struct DbContextMySql<T> {
    pool: Arc<T>
}
impl<T> DbContextMySql<T>{

    // Функція для отримання пулу з'єднань з базою даних
    pub fn get_pool(&self) -> Arc<T> {
        Arc::clone(&self.pool)
    }
}
#[async_trait]
impl Context<Pool<MySql>, String> for DbContextMySql<Pool<MySql>> {
    // Функція для створення нового контексту з'єднання з базою даних MySQL
    async fn new(connection: String) -> Self {
        let db_pool = MySqlPool::connect(&connection).await.expect("Failed to connect to the database");
        println!("Database connection established");
        DbContextMySql {
            pool: Arc::new(db_pool)
        }
    }
}
