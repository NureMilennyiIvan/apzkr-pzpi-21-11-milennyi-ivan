use std::sync::Arc;
use async_trait::async_trait;

// Асинхронний трейт для базових CRUD операцій сервісу
#[async_trait]
pub(crate) trait Service<T> {
    type Model;     // Тип моделі
    type Error;     // Тип помилки
    type ViewModel; // Тип ViewModel

    // Функція для створення нового сервісу
    fn new(pool: Arc<T>) -> Self;

    // Функція для створення нового елементу
    async fn create(&self, item: Self::Model) -> Result<Self::Model, Self::Error>;

    // Функція для видалення елементу за його ідентифікатором
    async fn delete(&self, item_id: u64) -> Result<(), Self::Error>;

    // Функція для оновлення існуючого елементу
    async fn update(&self, item: Self::Model) -> Result<Self::Model, Self::Error>;

    // Функція для отримання всіх елементів
    async fn get_all(&self) -> Result<Vec<Self::Model>, Self::Error>;

    // Функція для отримання елементу за його ідентифікатором
    async fn get_by_id(&self, id: u64) -> Result<Option<Self::Model>, Self::Error>;
}
