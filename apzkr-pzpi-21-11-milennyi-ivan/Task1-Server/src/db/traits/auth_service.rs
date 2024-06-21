use async_trait::async_trait;
use crate::db::traits::Service;

// Асинхронний трейт для сервісів аутентифікації
#[async_trait]
pub(crate) trait AuthService<T>: Service<T> {
    // Функція для перевірки наявності імені користувача
    async fn check_username(&self, user: &Self::Model) -> Result<bool, Self::Error>;

    // Функція для авторизації користувача за іменем та хешем пароля
    async fn authorize(&self, username: String, password_hash: String) -> Result<Option<Self::ViewModel>, Self::Error>;
}
