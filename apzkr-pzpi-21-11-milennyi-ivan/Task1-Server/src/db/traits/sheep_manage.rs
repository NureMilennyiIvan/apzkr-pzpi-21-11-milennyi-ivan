use async_trait::async_trait;
use crate::db::traits::Service;

// Асинхронний трейт для управління вівцями
#[async_trait]
pub(crate) trait SheepManage<T>: Service<T> {
    type SheepDetails; // Тип для деталей вівці

    // Функція для отримання всіх ViewModel овець за ідентифікатором пастуха
    async fn get_all_vms_by_shepherd_id(&self, id: u64) -> Result<Vec<Self::ViewModel>, Self::Error>;

    // Функція для отримання деталей вівці за її ідентифікатором
    async fn get_details_by_id(&self, id: u64) -> Result<Option<Self::SheepDetails>, Self::Error>;

    // Функція для зміни пастуха у вівці за ідентифікатором вівці та пастуха
    async fn change_shepherd(&self, sheep_id: u64, shepherd_id: Option<u64>) -> Result<(), Self::Error>;

    // Функція для зміни сканера температури у вівці за ідентифікатором вівці та сканера
    async fn change_temperature_scanner(&self, sheep_id: u64, temperature_scanner_id: Option<u64>) -> Result<(), Self::Error>;
}
