use async_trait::async_trait;

// Асинхронний трейт для контексту бази даних
#[async_trait]
pub(crate) trait Context<T, C> {
    // Асинхронна функція для створення нового контексту з'єднання з базою даних
    async fn new(connection: C) -> Self;
}
