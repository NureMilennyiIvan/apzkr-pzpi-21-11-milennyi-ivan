use serde::Serialize;
use sqlx::FromRow;
use utoipa::ToSchema;

// Структура, що представляє представлення пастуха (ViewModel)
#[derive(Debug, Serialize, FromRow, ToSchema)]
pub(crate) struct ShepherdVM {
    id: u64, // Ідентифікатор пастуха
    name: String, // Ім'я пастуха
    surname: String, // Прізвище пастуха
}
