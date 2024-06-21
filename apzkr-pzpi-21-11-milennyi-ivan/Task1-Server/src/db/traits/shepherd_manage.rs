use async_trait::async_trait;
use crate::db::traits::AuthService;

// Асинхронний трейт для управління пастухами, розширює AuthService
#[async_trait]
pub(crate) trait ShepherdManage<T>: AuthService<T> {
    // Функція для отримання всіх ViewModel пастухів
    async fn get_all_vms(&self) -> Result<Vec<Self::ViewModel>, Self::Error>;
}
