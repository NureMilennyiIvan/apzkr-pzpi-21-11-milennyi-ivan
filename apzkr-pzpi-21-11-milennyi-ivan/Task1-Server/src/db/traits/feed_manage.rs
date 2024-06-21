use async_trait::async_trait;
use crate::db::traits::Service;

// Асинхронний трейт для управління кормами
#[async_trait]
pub(crate) trait FeedManage<T>: Service<T> {
    // Функція для отримання всіх ViewModel кормів
    async fn get_all_vms(&self) -> Result<Vec<Self::ViewModel>, Self::Error>;
}
