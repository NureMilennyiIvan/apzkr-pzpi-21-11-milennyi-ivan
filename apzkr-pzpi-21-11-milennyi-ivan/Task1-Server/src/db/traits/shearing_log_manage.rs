use async_trait::async_trait;
use crate::db::traits::Service;

// Асинхронний трейт для управління логами стрижки
#[async_trait]
pub(crate) trait ShearingLogManage<T>: Service<T> {
    // Функція для отримання всіх ViewModel логів стрижки за ідентифікатором вівці
    async fn get_all_vms_by_sheep_id(&self, id: u64) -> Result<Vec<Self::ViewModel>, Self::Error>;
}
