use async_trait::async_trait;
use crate::db::traits::Service;

// Асинхронний трейт для управління породами овець
#[async_trait]
pub(crate) trait BreedManage<T>: Service<T> {
    // Функція для отримання всіх ViewModel порід
    async fn get_all_vms(&self) -> Result<Vec<Self::ViewModel>, Self::Error>;
}
