use serde::Serialize;
use sqlx::FromRow;
use utoipa::ToSchema;

// Структура, що представляє представлення комірника (ViewModel)
#[derive(Debug, Serialize, FromRow, ToSchema)]
pub(crate) struct StorekeeperVM {
    id: u64, // Ідентифікатор комірника
    name: String, // Ім'я комірника
    surname: String, // Прізвище комірника
}
