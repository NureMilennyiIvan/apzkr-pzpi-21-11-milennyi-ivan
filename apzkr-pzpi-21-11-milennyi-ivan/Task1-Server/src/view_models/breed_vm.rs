use serde::Serialize;
use sqlx::FromRow;
use utoipa::ToSchema;

// Структура, що представляє представлення породи (ViewModel)
#[derive(Debug, Serialize, FromRow, ToSchema)]
pub(crate) struct BreedVM {
    id: u64, // Ідентифікатор породи
    name: String, // Назва породи
    info: String, // Інформація про породу
    feed_name: String, // Назва корму
    sheep_count: u64, // Кількість овець цієї породи
}
