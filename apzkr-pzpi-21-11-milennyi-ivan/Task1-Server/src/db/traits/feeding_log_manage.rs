use async_trait::async_trait;
use crate::db::traits::Service;

// Асинхронний трейт для управління логами годування
#[async_trait]
pub(crate) trait FeedingLogManage<T>: Service<T> {
    // Функція для отримання всіх ViewModel логів годування за ідентифікатором вівці
    async fn get_all_vms_by_sheep_id(&self, id: u64) -> Result<Vec<Self::ViewModel>, Self::Error>;

    // Функція для отримання всіх ViewModel логів годування за ідентифікатором корму
    async fn get_all_vms_by_feed_id(&self, id: u64) -> Result<Vec<Self::ViewModel>, Self::Error>;
}
