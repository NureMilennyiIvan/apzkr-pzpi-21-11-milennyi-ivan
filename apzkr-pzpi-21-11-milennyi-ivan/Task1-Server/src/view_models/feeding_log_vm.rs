use serde::Serialize;
use sqlx::FromRow;
use utoipa::ToSchema;

// Структура, що представляє представлення логу годування (ViewModel)
#[derive(Debug, Serialize, FromRow, ToSchema)]
pub(crate) struct FeedingLogVM {
    id: u64, // Ідентифікатор логу годування
    timestamp: u64, // Час годування (у вигляді таймстемпу)
    amount: u64, // Кількість корму
    shepherd_name: Option<String>, // Ім'я пастуха (може бути відсутнім)
    shepherd_surname: Option<String>, // Прізвище пастуха (може бути відсутнім)
    sheep_id: u64 // Ідентифікатор вівці
}
